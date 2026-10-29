import fs from 'node:fs/promises';import {createHash}from'node:crypto';import path from'node:path';import{pathToFileURL}from'node:url';import{spawn}from'node:child_process';import{once}from'node:events';import puppeteer from'puppeteer';
const root=process.cwd(),args=process.argv.slice(2),option=n=>args.find(a=>a.startsWith('--'+n+'='))?.split('=').slice(1).join('='),limit=Number(option('limit')||Infinity);
const data=JSON.parse(await fs.readFile('scripts/pinterest/video-storyboards.json')),cards=data.filter(c=>!option('id')||c.id===option('id')).slice(0,limit),workers=Number(process.env.PINTEREST_VIDEO_WORKERS||3),fps=24;
const python=process.env.PINTEREST_PYTHON||'python3';
const pipelineHash=createHash('sha256');for(const name of ['scripts/pinterest/media/render-video.mjs','scripts/pinterest/media/prototype/compose.py'])pipelineHash.update(await fs.readFile(name));const version=pipelineHash.digest('hex');
const run=(cmd,argv)=>new Promise((resolve,reject)=>{const p=spawn(cmd,argv,{stdio:['ignore','ignore','pipe']});let err='';p.stderr.on('data',d=>err+=d);p.on('error',reject);p.on('exit',code=>code===0?resolve():reject(Error(cmd+': '+err.slice(-3000))));});
let cursor=0,done=0;const failed=[],active=new Map(),startedAt=new Date().toISOString();
const progressFile=path.join(root,'work/pinterest-media/render-progress.json');let progressChain=Promise.resolve();
function progress(){const state=JSON.stringify({version:2,startedAt,updatedAt:new Date().toISOString(),total:cards.length,done,failed,active:Object.fromEntries(active)},null,2);progressChain=progressChain.then(()=>fs.writeFile(progressFile+'.tmp',state)).then(()=>fs.rename(progressFile+'.tmp',progressFile));return progressChain;}
async function worker(workerId){
 const browser=await puppeteer.launch({executablePath:process.env.PINTEREST_CHROME||puppeteer.executablePath(),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files']});
 try{const page=await browser.newPage();await page.setViewport({width:1080,height:1920,deviceScaleFactor:1});let browserErrors=[];page.on('pageerror',e=>browserErrors.push(String(e)));
 while(cursor<cards.length){const card=cards[cursor++],output=path.join(root,'public/pinterest-media/video',card.id+'.mp4'),cover=path.join(root,'public/pinterest-media/covers',card.id+'.jpg');const stamp=path.join(root,'work/pinterest-media/rendered',card.id+'.json'),htmlFile=path.join(root,'public/pinterest-media/html',card.id+'.html');
 const hash=createHash('sha256').update(version).update(await fs.readFile(htmlFile));if(card.hero)hash.update(await fs.readFile('public'+card.hero));const sourceHash=hash.digest('hex');
 try{await fs.access(output);await fs.access(cover);if(JSON.parse(await fs.readFile(stamp)).sourceHash===sourceHash){done++;console.log(`[video] reuse ${done}/${cards.length} ${card.id}`);await progress();continue;}}catch{}
 active.set(workerId,{id:card.id,phase:'audio',percent:0});await progress();const start=Date.now();let encoder;
 try{
  browserErrors=[];await page.goto(pathToFileURL(htmlFile).href+'?export=1');await page.evaluate(()=>window.ready);
  const duration=await page.evaluate(()=>window.duration),frames=Math.ceil(duration*fps);if(!Number.isFinite(duration)||duration<40||duration>90)throw Error('Invalid HTML duration');
  const dir=path.join(root,'work/pinterest-media/audio',card.id);await fs.mkdir(dir,{recursive:true});let t=0;
  const boundaries=card.approvedPrototype?'6,12,21.333333,29.333333,38':card.scenes.slice(0,-1).map(s=>{t+=s.duration;return t}).join(',');
  await run(python,['scripts/pinterest/media/prototype/compose.py','--out='+path.join(dir,'sound.wav'),'--duration='+duration,'--seed='+(card.approvedPrototype?20261028:card.audioSeed),'--boundaries='+boundaries]);
  await run('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',path.join(dir,'sound.wav'),'-af','loudnorm=I=-18:TP=-1.5:LRA=8','-ar','48000','-c:a','aac','-b:a','192k',path.join(dir,'sound.m4a')]);
  encoder=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-vcodec','mjpeg','-i','pipe:0','-i',path.join(dir,'sound.m4a'),'-map','0:v:0','-map','1:a:0','-t',String(frames/fps),'-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-threads','2','-c:a','copy','-movflags','+faststart',output+'.part.mp4'],{stdio:['pipe','ignore','pipe']});
  let err='';encoder.stderr.on('data',d=>err+=d);const finished=new Promise((resolve,reject)=>{encoder.on('error',reject);encoder.on('exit',code=>code===0?resolve():reject(Error(err.slice(-3000))))});finished.catch(()=>{});
  for(let f=0;f<frames;f++){
   const result=await page.evaluate(t=>{const state=window.renderAt(t);return{state,jpeg:document.querySelector('canvas').toDataURL('image/jpeg',.93).split(',')[1]}},f/fps);
   if(result.state.overflow)throw Error('Text overflow: '+result.state.issues.join(', '));
   if(!encoder.stdin.write(Buffer.from(result.jpeg,'base64')))await once(encoder.stdin,'drain');
   if(f%240===0){active.set(workerId,{id:card.id,phase:'video',percent:Math.round(f/frames*100)});await progress();}
  }
  encoder.stdin.end();await finished;if(browserErrors.length)throw Error(browserErrors.join('\n'));
  await page.evaluate(()=>window.renderAt(2));await page.screenshot({path:cover,type:'jpeg',quality:92});await fs.rename(output+'.part.mp4',output);
  await fs.mkdir(path.dirname(stamp),{recursive:true});await fs.writeFile(stamp,JSON.stringify({pipelineVersion:2,sourceHash,duration:frames/fps,audio:'aac-stereo-music-and-effects-no-voice',textOverflow:false,renderedAt:new Date().toISOString()}));
  await fs.rm(dir,{recursive:true,force:true});done++;console.log(`[video] ${done}/${cards.length} ${card.id} (${duration.toFixed(1)}s, rendered in ${((Date.now()-start)/1000).toFixed(0)}s)`);
 }catch(error){if(encoder&&!encoder.killed)encoder.kill();failed.push({id:card.id,error:String(error)});console.error(`[video] FAILED ${card.id}: ${error}`);}
 finally{active.delete(workerId);await progress();}
 }
 }finally{await browser.close()}
}
await progress();await Promise.all(Array.from({length:Math.min(workers,cards.length)},(_,i)=>worker(i)));await progress();if(failed.length)process.exitCode=1;
