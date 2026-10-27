import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createECDH } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { Readable } from 'node:stream';
import { EventEmitter } from 'node:events';
import { normalizeSubscription, isPublicAddress, createPushAgent, deliverPush, sendPush } from '../proxy/push.mjs';
import { createPyodideLoader } from '../src/scripts/pyodide-loader.mjs';

function temp(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-reliability-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function sub(id = '1') {
  const ecdh = createECDH('prime256v1'); ecdh.generateKeys();
  return { endpoint: `https://fcm.googleapis.com/fcm/send/${id}`, keys: { p256dh: ecdh.getPublicKey().toString('base64url'), auth: Buffer.alloc(16, 3).toString('base64url') } };
}
test('push rejects local, arbitrary, misleading and malformed destinations and keys', () => {
  const good = sub();
  assert.equal(normalizeSubscription(good).endpoint, good.endpoint);
  const edge = 'https://wns2-bl2p.notify.windows.com/?token=opaque';
  assert.equal(normalizeSubscription({...good,endpoint:edge}).endpoint,edge);
  for (const endpoint of ['https://127.0.0.1/internal','https://[::1]/x','https://localhost/x','https://fcm.googleapis.com.evil.test/x','https://notify.windows.com.evil.test/x','https://evilnotify.windows.com/x','https://user@fcm.googleapis.com/x','https://fcm.googleapis.com:8443/x','http://fcm.googleapis.com/x']) assert.throws(() => normalizeSubscription({ ...good, endpoint }));
  assert.throws(() => normalizeSubscription({ ...good, keys: { ...good.keys, auth: 'abc' } }));
  assert.throws(() => normalizeSubscription({ ...good, keys: { ...good.keys, p256dh: Buffer.alloc(65).toString('base64url') } }));
});
test('DNS rejects private, mapped and reserved addresses on the connection lookup', async () => {
  for (const ip of ['127.0.0.1','10.0.0.1','100.64.0.1','172.16.1.1','169.254.169.254','192.168.1.1','::1','::ffff:127.0.0.1','fc00::1','fe80::1','2001:db8::1','2002:7f00:1::']) assert.equal(isPublicAddress(ip), false, ip);
  assert.equal(isPublicAddress('8.8.8.8'), true);
  assert.equal(isPublicAddress('2606:4700:4700::1111'), true);
  const agent = createPushAgent((host, options, done) => done(null, [{address:'127.0.0.1', family:4}]));
  await new Promise(resolve => agent.options.lookup('fcm.googleapis.com', {}, error => { assert.match(error.message, /non-public/); resolve(); }));
  agent.destroy();
});
test('push counts successes, expiration, temporary failure and retries only failed recipients', async () => {
  const subscriptions = [sub('ok'), sub('expired'), sub('busy'), {endpoint:'https://127.0.0.1/x'}];
  const delivered = new Set();
  let saved = 0;
  const first = await deliverPush(subscriptions, {}, async item => {
    if (item.endpoint.endsWith('expired')) throw {statusCode:410};
    if (item.endpoint.endsWith('busy')) throw {statusCode:503};
  }, {delivered, checkpoint: () => saved++});
  assert.deepEqual([first.sent, first.expired, first.failed, first.invalid, saved], [1,1,1,1,1]);
  const called = [];
  const second = await deliverPush(subscriptions.filter(s => !first.remove.has(s.endpoint)), {}, async item => called.push(item.endpoint), {delivered});
  assert.equal(second.sent, 1); assert.equal(second.skipped, 1);
  assert.deepEqual(called, [subscriptions[2].endpoint]);
});
test('push bounds parallel delivery', async () => {
  let active = 0, peak = 0;
  await deliverPush(Array.from({length:20}, (_, i) => sub(String(i))), {}, async () => {
    peak = Math.max(peak, ++active);
    await new Promise(resolve => setTimeout(resolve, 2)); active--;
  }, { concurrency: 3 });
  assert.equal(peak, 3);
});

const mockFetch = `
import fs from 'node:fs';
globalThis.fetch = async (url, options = {}) => {
 const body = JSON.parse(options.body || '{}');
 fs.appendFileSync(process.env.REQUEST_LOG, JSON.stringify({url,body})+'\\n');
 if (url.includes('api.brevo.com') && !options.method) return Response.json({campaigns:process.env.REUSE ? [{name:'article:fixture',id:17,status:'queued'}] : []});
 if (url.includes('api.brevo.com')) return process.env.FAIL_EMAIL && body.subject === 'fail' ? new Response('',{status:503}) : Response.json({id:17});
 if (url === 'https://ntfy.test') return new Response('{}');
 if (url === 'https://push.test/send') return Response.json({sent:1,failed:Number(process.env.FAIL_PUSH || 0),expired:0});
 throw new Error('Unexpected network request');
};`;
function fixture(t) {
  const dir = temp(t), content = path.join(dir,'content');
  fs.mkdirSync(path.join(content, 'science'), {recursive:true});
  fs.writeFileSync(path.join(content,'science','fixture.md'), '---\ntitle: fixture\ncategory: science\npublishDate: "2020-01-01"\n---\nTest');
  const preload = path.join(dir,'mock.mjs'); fs.writeFileSync(preload, mockFetch);
  const state = path.join(dir, 'state.json'), log = path.join(dir,'requests.jsonl');
  const run = (script, overrides = {}) => spawnSync(process.execPath, [script], {
    encoding:'utf8', timeout:10_000,
    env:{...process.env, NODE_OPTIONS:`--import=${preload}`, BLOG_CONTENT_DIR:content, NEWSLETTER_STATE_FILE:state, NTFY_STATE_FILE:state,
      BREVO_API_KEY:'fake', BREVO_SENDER_EMAIL:'test@example.com', NTFY_URL:'https://ntfy.test', PUSH_PROXY_URL:'https://push.test', PUSH_SEND_TOKEN:'fake', REQUEST_LOG:log, ...overrides},
  });
  return {dir, content, state, log, run};
}
test('newsletter dry-run (including seed) leaves existing state byte-for-byte unchanged', t => {
  const f = fixture(t), original = '{"sent":[],"updatedAt":null}\n'; fs.writeFileSync(f.state, original);
  for (const SEED of ['0','1']) {
    const r = f.run('scripts/newsletter-dispatch.mjs', {DRY_RUN:'1', SEED});
    assert.equal(r.status, 0, r.stderr); assert.equal(fs.readFileSync(f.state,'utf8'), original);
  }
  assert.equal(fs.existsSync(f.log), false);
});
test('newsletter dry-run never creates missing state', t => {
  const f = fixture(t); assert.equal(f.run('scripts/newsletter-dispatch.mjs', {DRY_RUN:'1'}).status,0);
  assert.equal(fs.existsSync(f.state), false);
});
test('newsletter persists partial success and returns failure; retries reconcile remote campaigns', t => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.content,'science','failure.md'), '---\ntitle: fail\ncategory: science\npublishDate: "2020-01-01"\n---\nTest');
  const r = f.run('scripts/newsletter-dispatch.mjs',{FAIL_EMAIL:'1'});
  assert.equal(r.status,1,r.stderr); assert.deepEqual(JSON.parse(fs.readFileSync(f.state)).sent,['fixture']);
  fs.rmSync(path.join(f.content,'science','failure.md'));
  fs.rmSync(f.state); fs.rmSync(f.log);
  const reused = f.run('scripts/newsletter-dispatch.mjs',{REUSE:'1'});
  assert.equal(reused.status,0,reused.stderr);
  assert.equal(fs.readFileSync(f.log,'utf8').trim().split('\n').length,1);
  assert.deepEqual(JSON.parse(fs.readFileSync(f.state)).sent,['fixture']);
});
test('corrupt newsletter state fails closed before any network request', t => {
  const f = fixture(t); fs.writeFileSync(f.state, '{broken');
  assert.equal(f.run('scripts/newsletter-dispatch.mjs').status,1); assert.equal(fs.existsSync(f.log),false);
});
test('notification channel success survives the other channel failing, even with HTTP 200', t => {
  const f = fixture(t);
  const first = f.run('scripts/notify-ntfy.mjs',{FAIL_PUSH:'1'});
  assert.equal(first.status,1,first.stderr);
  const state = JSON.parse(fs.readFileSync(f.state));
  assert.deepEqual(state.channels.ntfy,['fixture']); assert.deepEqual(state.channels.push,[]);
  fs.rmSync(f.log);
  const second = f.run('scripts/notify-ntfy.mjs'); assert.equal(second.status,0,second.stderr);
  const requests = fs.readFileSync(f.log,'utf8').trim().split('\n').map(JSON.parse);
  assert.equal(requests.length,1); assert.equal(requests[0].url,'https://push.test/send');
  assert.equal(requests[0].body.notificationId,'article:fixture');
});
test('legacy notification state does not resend the historical backlog', t => {
  const f = fixture(t); fs.writeFileSync(f.state, JSON.stringify({sent:['fixture']}));
  assert.equal(f.run('scripts/notify-ntfy.mjs').status,0); assert.equal(fs.existsSync(f.log),false);
});
test('deployment retries a failed build even though checkout already advanced', t => {
  const dir = temp(t), remote = path.join(dir,'remote'), repo = path.join(dir,'repo');
  const git = (cwd, ...args) => {
    const r = spawnSync('git',args,{cwd,encoding:'utf8'}); assert.equal(r.status,0,r.stderr); return r.stdout.trim();
  };
  fs.mkdirSync(remote); git(remote,'init','-b','main'); git(remote,'config','user.name','Test'); git(remote,'config','user.email','test@example.com');
  fs.writeFileSync(path.join(remote,'file'),'one'); git(remote,'add','.'); git(remote,'commit','-m','one');
  git(dir,'clone',remote,repo);
  fs.writeFileSync(path.join(remote,'file'),'two'); git(remote,'commit','-am','two');
  const command = path.join(dir,'deploy'); fs.writeFileSync(command, '#!/bin/sh\necho attempt >> "$ATTEMPTS"\n[ "$(wc -l < "$ATTEMPTS")" -gt 1 ]\n'); fs.chmodSync(command,0o755);
  const env = {...process.env, REPO:repo, DEPLOY_CMD:command, DEPLOY_LOG:path.join(dir,'deploy.log'), DEPLOY_LOCK:path.join(dir,'lock'), ATTEMPTS:path.join(dir,'attempts')};
  const poll = () => spawnSync('bash',['deploy/auto-deploy-poll.sh'],{env});
  assert.equal(poll().status,1); assert.equal(poll().status,0); assert.equal(poll().status,0);
  assert.equal(fs.readFileSync(env.ATTEMPTS,'utf8').trim().split('\n').length,2);
  assert.equal(fs.readFileSync(path.join(repo,'.git','blog-last-deployed'),'utf8').trim(),git(remote,'rev-parse','HEAD'));
});
test('Python engine failure and timeout release shared loader for retry', async () => {
  const window = {};
  let fail = true;
  const document = {createElement:() => ({remove(){}}),head:{appendChild(script){queueMicrotask(() => {
    if (fail) script.onerror();
    else { window.loadPyodide = async () => ({ready:true}); script.onload(); }
  });}}};
  const load = createPyodideLoader({window,document,timeoutMs:10});
  const first = load(); assert.equal(load(),first);
  await assert.rejects(first,/Échec/); fail = false;
  assert.deepEqual(await load(), {ready:true});
  const stalled = {loadPyodide: () => new Promise(() => {})};
  const again = createPyodideLoader({window:stalled,document,timeoutMs:5});
  await assert.rejects(again(),/Délai/); assert.equal(stalled.__pyodideReady,undefined);
  stalled.loadPyodide = async () => 42; assert.equal(await again(),42);
});

test('actual proxy rejects local subscriptions and returns 503 for incomplete delivery with accurate counts', async t => {
  const dir = temp(t);
  let handler, calls = 0, failing = true;
  const code = fs.readFileSync('proxy/newsletter.mjs','utf8').replace(/^import .+;\n/gm,'');
  const context = {
    http: {createServer(fn){handler=fn; return {listen(){}};}},
    ...Object.fromEntries(['readFileSync','writeFileSync','mkdirSync','existsSync','renameSync'].map(name => [name, fs[name]])),
    webpush:{setVapidDetails(){}, async sendNotification(){ calls++; if (failing) throw {statusCode:503}; }},
    normalizeSubscription, createPushAgent, deliverPush, sendPush: (webpush, ...args) => webpush.sendNotification(...args),
    process:{env:{PUSH_DATA_DIR:dir,VAPID_PUBLIC_KEY:'fake',PUSH_SEND_TOKEN:'fake'}},
    console:{log(){},warn(){},error(){}}, URL, Buffer, Set, Map,
  };
  runInNewContext(code, context);
  async function request(route, body) {
    const req = Readable.from([Buffer.from(JSON.stringify(body))]);
    Object.assign(req,{method:'POST',url:route,headers:{origin:'https://blogdungaucher.com',authorization:'Bearer fake'},socket:{remoteAddress:'127.0.0.1'}});
    let status, result;
    await handler(req,{writeHead(code){status=code;},end(body){result=JSON.parse(body);}});
    return {status,body:result};
  }
  assert.equal((await request('/push/subscribe',{...sub(),endpoint:'https://127.0.0.1/internal'})).status,400);
  assert.equal((await request('/push/subscribe',sub())).status,200);
  const first = await request('/push/send',{notificationId:'article:test'});
  assert.equal(first.status,503); assert.equal(first.body.sent,0); assert.equal(first.body.failed,1);
  failing = false;
  assert.equal((await request('/push/send',{notificationId:'article:test'})).body.sent,1);
  assert.equal((await request('/push/send',{notificationId:'article:test'})).body.skipped,1);
  assert.equal(calls,2);
});

test('button and settings share preference and do not claim a failed subscription or removal succeeded', async () => {
  const data = new Map([['blogdungaucher.cookieConsent.v1', JSON.stringify({notifications:false})]]);
  const publicKey = Buffer.alloc(65,1), key = publicKey.toString('base64url');
  let subscription = null, failing = false;
  const requests = [];
  const reg = {pushManager:{async getSubscription(){return subscription;},async subscribe(){
    subscription = {endpoint:'https://fcm.googleapis.com/fcm/send/test',options:{applicationServerKey:Uint8Array.from(publicKey).buffer},toJSON(){return {endpoint:this.endpoint};},async unsubscribe(){subscription=null;return true;}};
    return subscription;
  }}};
  const context = {localStorage:{getItem:k => data.get(k) ?? null,setItem:(k,v) => data.set(k,v),removeItem:k => data.delete(k)},
    document:{dispatchEvent(){}},CustomEvent:class {constructor(type, options){this.type=type; this.detail=options.detail;}},
    window:{PushManager:{},Notification:{}},Notification:{permission:'granted',requestPermission:async () => 'granted'},
    navigator:{serviceWorker:{ready:Promise.resolve(reg)}},atob,Uint8Array,setTimeout,clearTimeout,AbortSignal,
    fetch:async url => {requests.push(url); return {ok:!failing,status:failing ? 503 : 200};},
  };
  runInNewContext(fs.readFileSync('src/scripts/push-preferences.mjs','utf8').replace(/^export /gm,''),context);
  await context.setPushEnabled(true,key);
  assert.equal(context.readPushPreference(),true); assert.equal(await context.getPushActive(key),true);
  failing = true;
  await assert.rejects(context.setPushEnabled(false,key),/503/);
  assert.equal(context.readPushPreference(),true); assert.ok(subscription);
  failing = false;
  await context.setPushEnabled(false,key);
  assert.equal(context.readPushPreference(),false); assert.equal(subscription,null);
  // Existing subscriptions from the former direct-ntfy path must be registered
  // with the proxy before either control claims that notifications are active.
  await reg.pushManager.subscribe();
  data.set('blogdungaucher.cookieConsent.v1', JSON.stringify({notifications:true}));
  failing = true;
  await assert.rejects(context.getPushActive(key),/503/);
  failing = false;
  assert.equal(await context.getPushActive(key),true);
  const before = requests.length;
  assert.equal(await context.getPushActive(key),true);
  assert.equal(requests.length,before);
  await context.setPushEnabled(false,key);
  failing = true;
  await assert.rejects(context.setPushEnabled(true,key),/503/);
  assert.equal(context.readPushPreference(),false); assert.equal(await context.getPushActive(key),false);
  assert.ok(requests.every(url => url.startsWith('/push/')));
});

test('push transport deadline aborts a stalled request including DNS', async () => {
  let destroyed = false;
  const request = () => {
    const req = new EventEmitter(); req.end = () => {};
    req.destroy = error => { destroyed = true; req.emit('error',error); };
    return req;
  };
  await assert.rejects(sendPush({generateRequestDetails: () => ({endpoint:sub().endpoint})},sub(),'{}',null,{request,timeoutMs:5}),/deadline/);
  assert.equal(destroyed,true);
});
