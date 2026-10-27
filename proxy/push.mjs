import { lookup } from 'node:dns';
import { Agent, request as httpsRequest } from 'node:https';
import { BlockList, isIP } from 'node:net';
import { ECDH } from 'node:crypto';

// Only browser push services; no arbitrary HTTPS destinations or custom ports.
const PUSH_HOSTS = new Set(['fcm.googleapis.com', 'updates.push.services.mozilla.com', 'web.push.apple.com', 'notify.windows.com']);
const allowedHost = hostname => PUSH_HOSTS.has(hostname) || hostname.endsWith('.notify.windows.com');
export function normalizeSubscription(value) {
  if (!value || typeof value.endpoint !== 'string' || value.endpoint.length > 4096) throw new Error('invalid endpoint');
  const url = new URL(value.endpoint);
  if (url.protocol !== 'https:' || !allowedHost(url.hostname) || url.port || url.username || url.password || url.hash || (url.pathname === '/' && !url.search)) throw new Error('unsupported push service');
  const key = (name, length) => {
    const text = value.keys?.[name];
    if (typeof text !== 'string' || !/^[A-Za-z0-9_-]+={0,2}$/.test(text)) throw new Error('invalid push key');
    const bytes = Buffer.from(text, 'base64url');
    if (bytes.length !== length || bytes.toString('base64url') !== text.replace(/=+$/, '')) throw new Error('invalid push key');
    return bytes;
  };
  const publicKey = key('p256dh', 65);
  if (publicKey[0] !== 4) throw new Error('invalid push public key');
  ECDH.convertKey(publicKey, 'prime256v1'); // Reject points outside the curve.
  key('auth', 16);
  return { endpoint: url.href, keys: { p256dh: value.keys.p256dh, auth: value.keys.auth } };
}

const blocked = new BlockList();
for (const [address, prefix] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]]) blocked.addSubnet(address, prefix, 'ipv4');
const globalV6 = new BlockList();
globalV6.addSubnet('2000::', 3, 'ipv6');
for (const [address, prefix] of [['2001::',23],['2001:db8::',32],['2002::',16]]) blocked.addSubnet(address, prefix, 'ipv6');
export function isPublicAddress(address) {
  const family = isIP(address);
  return family === 4 ? !blocked.check(address, 'ipv4') : family === 6 && globalV6.check(address, 'ipv6') && !blocked.check(address, 'ipv6');
}

// Validate DNS on the actual socket lookup, preventing a second unchecked lookup.
export function createPushAgent(resolve = lookup) {
  return new Agent({ lookup(hostname, options, callback) {
    if (!allowedHost(hostname)) return callback(new Error('unsupported push host'));
    resolve(hostname, { all: true, family: options.family || 0 }, (error, addresses) => {
      if (error) return callback(error);
      if (!addresses?.length || addresses.some(a => !isPublicAddress(a.address))) return callback(new Error('non-public push address'));
      callback(null, ...(options.all ? [addresses] : [addresses[0].address, addresses[0].family]));
    });
  }});
}

// Use web-push for encryption/VAPID, then a transport with an absolute deadline.
// Unlike an inactivity timeout, this also bounds DNS and slow response bodies.
export async function sendPush(webpush, subscription, payload, agent, { request = httpsRequest, timeoutMs = 10_000 } = {}) {
  const details = webpush.generateRequestDetails(subscription, payload, { TTL: 86400 });
  return new Promise((resolve, reject) => {
    let timer;
    const finish = (error, result) => { clearTimeout(timer); error ? reject(error) : resolve(result); };
    const req = request(details.endpoint, { method: details.method, headers: details.headers, agent }, response => {
      response.on('error', error => finish(error));
      response.on('end', () => {
        const statusCode = response.statusCode;
        if (statusCode >= 200 && statusCode < 300) finish(null, { statusCode });
        else finish(Object.assign(new Error(`Push HTTP ${statusCode}`), { statusCode }));
      });
      response.resume();
    });
    req.on('error', error => finish(error));
    timer = setTimeout(() => req.destroy(new Error('Push deadline exceeded')), timeoutMs);
    req.end(details.body);
  });
}

export async function deliverPush(subscriptions, payload, send, { delivered = new Set(), checkpoint = () => {}, concurrency = 8, maxDuration = 20_000 } = {}) {
  const result = { sent: 0, failed: 0, expired: 0, skipped: 0, invalid: 0 };
  const remove = new Set();
  let next = 0;
  let stopped = false;
  const deadline = Date.now() + maxDuration;
  async function worker() {
    while (!stopped && next < subscriptions.length) {
      if (Date.now() >= deadline) { result.failed += subscriptions.length - next; next = subscriptions.length; break; }
      const raw = subscriptions[next++];
      let sub;
      try { sub = normalizeSubscription(raw); }
      catch { result.invalid++; remove.add(raw?.endpoint); continue; }
      if (delivered.has(sub.endpoint)) { result.skipped++; continue; }
      try {
        await send(sub, JSON.stringify(payload));
      } catch (error) {
        if ([404, 410].includes(error.statusCode)) { result.expired++; remove.add(sub.endpoint); }
        else result.failed++;
        continue;
      }
      result.sent++;
      delivered.add(sub.endpoint);
      try { checkpoint(); } catch (error) { stopped = true; throw error; }
    }
  }
  const workers = await Promise.allSettled(Array.from({ length: Math.min(concurrency, subscriptions.length) }, worker));
  const failure = workers.find(result => result.status === "rejected");
  if (failure) throw failure.reason;
  return { ...result, remove };
}
