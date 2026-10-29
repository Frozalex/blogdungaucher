import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';

// The lock inode is permanent. Kernel flock ownership, not stale PID metadata,
// serializes contenders and is released automatically after a process crash.
export async function acquireRenderLock(file,{onLost=()=>{}}={}){
 await fs.mkdir(path.dirname(file),{recursive:true});
 const keeper=spawn('flock',['--no-fork','--exclusive','--nonblock','--conflict-exit-code','73',file,process.execPath,'-e',"process.stdout.write('locked\\n');process.stdin.resume();process.stdin.on('end',()=>process.exit(0));"],{stdio:['pipe','pipe','pipe']});
 let acquired=false,releasing=false,exited=false,stderr='',stdout='';
 keeper.stderr.on('data',bytes=>stderr+=bytes);
 keeper.stdin.on('error',()=>{});
 const closed=new Promise(resolve=>keeper.once('close',()=>{exited=true;resolve()}));
 try{await new Promise((resolve,reject)=>{
  keeper.once('error',reject);
  keeper.stdout.on('data',bytes=>{stdout+=bytes;if(!stdout.includes('\n'))return;if(stdout.trim()!=='locked'){reject(Error('Unexpected render lock handshake'));return}acquired=true;resolve()});
  keeper.once('close',code=>{if(!acquired)reject(Error(code===73?'Article video rendering already active':`Cannot acquire render lock: ${stderr||code}`));else if(!releasing)onLost(Error('Article video render lock was lost'));});
 })}catch(error){releasing=true;keeper.stdin.end();keeper.kill('SIGTERM');throw error}
 const release=async()=>{releasing=true;keeper.stdin.end();let timer;try{await Promise.race([closed,new Promise(resolve=>{timer=setTimeout(()=>{keeper.kill('SIGKILL');resolve()},5000)})])}finally{clearTimeout(timer)}};
 try{await fs.writeFile(file,JSON.stringify({pid:process.pid,keeperPid:keeper.pid,startedAt:new Date().toISOString()})+'\n')}catch(error){await release();throw error}
 return{release,assertHeld(){if(exited||releasing)throw Error('Article video render lock was lost')}};
}
