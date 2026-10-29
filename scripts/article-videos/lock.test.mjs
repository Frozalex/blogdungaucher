import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {acquireRenderLock} from './lock.mjs';
const exec=promisify(execFile);

test('concurrent recovery of stale metadata has exactly one owner and never replaces the lock inode',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'article-video-lock-')),file=path.join(root,'.render.lock');
 const locks=[];
 try{
  await fs.writeFile(file,JSON.stringify({pid:99999999,startedAt:'2000-01-01T00:00:00Z'}));
  const inode=(await fs.stat(file)).ino;
  const contenders=await Promise.allSettled(Array.from({length:12},()=>acquireRenderLock(file)));
  locks.push(...contenders.filter(r=>r.status==='fulfilled').map(r=>r.value));
  assert.equal(locks.length,1);
  for(const loser of contenders.filter(r=>r.status==='rejected'))assert.match(loser.reason.message,/already active/);
  assert.equal((await fs.stat(file)).ino,inode);
  await assert.rejects(acquireRenderLock(file),/already active/);
  assert.doesNotThrow(()=>locks[0].assertHeld());
  await locks.shift().release();
  locks.push(await acquireRenderLock(file));
  assert.equal((await fs.stat(file)).ino,inode);
  await assert.rejects(acquireRenderLock(file),/already active/);
 }finally{for(const lock of locks)await lock.release();await fs.rm(root,{recursive:true,force:true})}
});

test('an abruptly exiting owner releases its kernel lock without removing the lock file',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'article-video-crash-')),file=path.join(root,'.render.lock');let lock;
 try{
  const code=`import {acquireRenderLock} from ${JSON.stringify(new URL('./lock.mjs',import.meta.url).href)};await acquireRenderLock(process.argv[1]);process.exit(0);`;
  await exec(process.execPath,['--input-type=module','-e',code,file]);
  const inode=(await fs.stat(file)).ino;
  // Pipe EOF reaches the keeper asynchronously after its owner exits.
  for(let attempt=0;attempt<20&&!lock;attempt++)try{lock=await acquireRenderLock(file)}catch(error){if(!/already active/.test(error.message)||attempt===19)throw error;await new Promise(resolve=>setTimeout(resolve,25))}
  assert.doesNotThrow(()=>lock.assertHeld());
  assert.equal((await fs.stat(file)).ino,inode);
 }finally{if(lock)await lock.release();await fs.rm(root,{recursive:true,force:true})}
});
