import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import puppeteer from 'puppeteer';
import {options,atomic,sha,pipelineHash,preparationHash,assertPreparation,scriptDirectory} from './common.mjs';
import {acquireRenderLock} from './lock.mjs';
const args=options(),root=process.cwd(),out=path.resolve(args.out||'media/article-videos');
if((args['include-future']||(args.at&&Date.parse(args.at)>Date.now()))&&(out===path.resolve('public')||out.startsWith(path.resolve('public')+path.sep)))throw Error('Future video preparation/rendering is forbidden in public storage');
const work=path.resolve('work/article-videos/render-'+sha(out).slice(0,12));await fs.mkdir(work,{recursive:true});
let browser,stopping=false;const children=new Set();
const lock=await acquireRenderLock(path.join(out,'.render.lock'),{onLost(){stopping=true;for(const child of children)child.kill('SIGTERM')}});
for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>{stopping=true;for(const child of children)child.kill('SIGTERM')});
const launch=()=>puppeteer.launch({executablePath:process.env.ARTICLE_VIDEO_CHROME||process.env.PINTEREST_CHROME||puppeteer.executablePath(),headless:true,protocolTimeout:60000,args:['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files']});
async function closeBrowser(){if(!browser)return;const old=browser;browser=null;let timer;try{await Promise.race([old.close().catch(()=>{}),new Promise(resolve=>{timer=setTimeout(()=>{old.process()?.kill('SIGKILL');resolve()},5000)})])}finally{clearTimeout(timer)}}
async function closePage(page){let timer;try{await Promise.race([page.close().catch(()=>{}),new Promise(resolve=>{timer=setTimeout(resolve,5000)})])}finally{clearTimeout(timer)}}
function run(cmd,argv,timeout=180000){return new Promise((resolve,reject)=>{const child=spawn(cmd,argv,{stdio:['ignore','pipe','pipe'],timeout});children.add(child);let stdout='',stderr='';child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);child.on('error',reject);child.on('close',code=>{children.delete(child);code===0?resolve({stdout,stderr}):reject(Error(cmd+': '+stderr.slice(-3000)))});})}
const progress={startedAt:new Date().toISOString(),updatedAt:null,total:0,done:0,reused:0,failed:[],active:null};
const progressFile=path.resolve(args.progress||'work/article-videos/render-progress.json');
async function saveProgress(){progress.updatedAt=new Date().toISOString();await atomic(progressFile,JSON.stringify(progress,null,2)+'\n')}
async function publish(entry){lock.assertHeld();const file=path.join(out,'manifest.json');let manifest={version:1,entries:[]};try{manifest=JSON.parse(await fs.readFile(file,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}manifest.entries=manifest.entries.filter(e=>e.slug!==entry.slug).concat(entry).sort((a,b)=>a.slug.localeCompare(b.slug));manifest.updatedAt=new Date().toISOString();await atomic(file,JSON.stringify(manifest,null,2)+'\n')}
async function renderCard(card,version,html,renderSignature){
 const temp=path.join(work,card.slug);await fs.mkdir(temp,{recursive:true});
 const htmlPath=path.join(out,card.html),video=path.join(out,card.video),poster=path.join(out,card.poster);
 await fs.mkdir(path.dirname(video),{recursive:true});await fs.mkdir(path.dirname(poster),{recursive:true});
 if(!browser?.connected)browser=await launch();const page=await browser.newPage();await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
 const browserErrors=[];page.on('pageerror',e=>browserErrors.push(String(e)));let encoder;
 try{
  await page.goto(pathToFileURL(htmlPath).href+'?export=1',{waitUntil:'load',timeout:45000});await page.evaluate(()=>window.ready);
  const duration=await page.evaluate(()=>window.duration),frames=Math.ceil(duration*24);
  if(!Number.isFinite(duration)||Math.abs(duration-card.duration)>.05)throw Error('Animation timeline mismatch');
  progress.active={slug:card.slug,phase:'audio',percent:0};await saveProgress();
  const wav=path.join(temp,'sound.wav'),aac=path.join(temp,'sound.m4a');
  await run(process.env.ARTICLE_VIDEO_PYTHON||process.env.PINTEREST_PYTHON||'python3',[path.join(scriptDirectory,'compose.py'),'--out='+wav,'--duration='+duration,'--seed='+card.audioSeed,'--boundaries='+card.scenes.slice(1).map(s=>s.start).join(',')]);
  await run('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',wav,'-af','loudnorm=I=-18:TP=-1.5:LRA=8','-ar','48000','-c:a','aac','-b:a','192k',aac]);
  const tempVideo=path.join(temp,'film.mp4');
  encoder=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate','24','-vcodec','mjpeg','-i','pipe:0','-i',aac,'-map','0:v:0','-map','1:a:0','-t',String(frames/24),'-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-threads','2','-c:a','copy','-movflags','+faststart',tempVideo],{stdio:['pipe','ignore','pipe'],timeout:900000});children.add(encoder);
  let stderr='';encoder.stderr.on('data',b=>stderr+=b);
  const finished=new Promise((resolve,reject)=>{encoder.on('error',reject);encoder.stdin.on('error',reject);encoder.on('close',code=>{children.delete(encoder);code===0?resolve():reject(Error('Video encoder failed: '+stderr.slice(-2000)))})});finished.catch(()=>{});
  for(let frame=0;frame<frames;frame++){
   if(stopping)throw Error('Rendering interrupted');
   const data=await page.evaluate(t=>({state:window.renderAt(t),jpeg:document.querySelector('canvas').toDataURL('image/jpeg',.92).split(',')[1]}),frame/24);
   if(data.state.overflow)throw Error('Text overflow: '+data.state.issues.join('; '));
   if(!encoder.stdin.write(Buffer.from(data.jpeg,'base64')))await Promise.race([once(encoder.stdin,'drain'),finished.then(()=>{throw Error('Video encoder closed early')})]);
   if(frame%240===0){progress.active={slug:card.slug,phase:'video',percent:Math.round(frame/frames*100)};await saveProgress()}
  }
  encoder.stdin.end();await finished;if(browserErrors.length)throw Error(browserErrors.join('; '));
  const posterData=await page.evaluate(()=>{window.renderAt(2);return document.querySelector('canvas').toDataURL('image/jpeg',.94).split(',')[1]});
  const posterBytes=Buffer.from(posterData,'base64'),videoBytes=await fs.readFile(tempVideo);
  const probe=JSON.parse((await run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',tempVideo])).stdout);
  const picture=probe.streams.find(s=>s.codec_type==='video'),audio=probe.streams.find(s=>s.codec_type==='audio');
  if(picture?.codec_name!=='h264'||picture.width!==1920||picture.height!==1080||picture.avg_frame_rate!=='24/1'||!['yuv420p','yuvj420p'].includes(picture.pix_fmt)||audio?.codec_name!=='aac'||audio.channels!==2||audio.sample_rate!=='48000'||Math.abs(+picture.duration- +audio.duration)>.12)throw Error('Invalid MP4 streams');
  const soundLog=(await run('ffmpeg',['-hide_banner','-nostats','-i',tempVideo,'-vn','-af','ebur128=peak=true,silencedetect=noise=-50dB:d=3','-f','null','-'])).stderr;
  const summary=soundLog.slice(soundLog.lastIndexOf('Summary:')),integrated=Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)?.[1]),peak=Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1]);
  if(!Number.isFinite(integrated)||integrated< -20||integrated> -16||!Number.isFinite(peak)||peak> -.5||/silence_start:/.test(soundLog))throw Error('Soundtrack quality outside expected bounds');
  await atomic(video,videoBytes);await atomic(poster,posterBytes);
  const entry={slug:card.slug,title:card.title,category:card.category,publishDate:card.publishDate,draft:card.draft,noindex:card.noindex,sourceFile:card.sourceFile,sourceSha256:card.sourceSha256,summarySha256:card.summarySha256,preparationHash:card.preparationHash,fonts:card.fonts,logoSha256:card.logoSha256,video:`/article-videos/${card.video}`,poster:`/article-videos/${card.poster}`,html:`/article-videos/${card.html}`,duration:Number(probe.format.duration),width:1920,height:1080,fps:24,codec:'h264',sha256:sha(videoBytes),posterSha256:sha(posterBytes),htmlSha256:sha(html),renderSignature,hero:card.hero,scenes:card.scenes.map(({heading,text})=>({heading,text})),layoutSignature:card.compositionSignature,audio:{codec:'aac',channels:2,sampleRate:48000,integratedLufs:integrated,truePeakDb:peak,prolongedSilence:false},noVoiceOver:true,textOverflow:false,renderedAt:new Date().toISOString()};
  await publish(entry);await atomic(path.join(work,card.slug+'.json'),JSON.stringify(entry,null,2)+'\n');await fs.rm(temp,{recursive:true,force:true});return entry;
 }finally{if(encoder&&encoder.exitCode===null)encoder.kill('SIGTERM');await closePage(page)}
}
try{
 const planned=JSON.parse(await fs.readFile(path.join(out,'storyboards.json'),'utf8'));
 const cards=planned.filter(c=>(!args.id||c.slug===args.id)&&!c.draft&&(args['include-future']||Date.parse(c.publishDate)<=Date.parse(args.at||new Date().toISOString()))).slice(0,Number(args.limit||Infinity));
 progress.total=cards.length;await saveProgress();const version=await pipelineHash(),generator=await preparationHash();
 for(const card of cards){
  if(stopping)throw Error('Rendering interrupted');
  if(!/^[a-z0-9-]+$/.test(card.slug)||card.video!==`video/${card.slug}.mp4`||card.poster!==`posters/${card.slug}.jpg`||card.html!==`html/${card.slug}.html`)throw Error('Unexpected prepared asset path');
  if(sha(await fs.readFile(path.join(root,'public/images/logo-transparent.svg')))!==card.logoSha256)throw Error('Logo changed after preparation');
  if(sha(await fs.readFile(path.join(root,card.sourceFile)))!==card.sourceSha256)throw Error('Article changed after preparation: '+card.slug);
  for(const key of ['regular','bold'])if(sha(await fs.readFile(path.join(out,'assets',`studio-${key}.ttf`)))!==card.fonts[key])throw Error('Animation font changed: '+key);
  const html=await fs.readFile(path.join(out,card.html),'utf8');if(sha(html)!==card.htmlSha256)throw Error('Prepared HTML changed: '+card.slug);
  assertPreparation(card,html,generator);
  const renderSignature=sha(version+html);let reused=false;
  try{const saved=JSON.parse(await fs.readFile(path.join(work,card.slug+'.json'),'utf8'));if(saved.renderSignature===renderSignature&&sha(await fs.readFile(path.join(out,card.video)))===saved.sha256&&sha(await fs.readFile(path.join(out,card.poster)))===saved.posterSha256){await publish(saved);reused=true}}catch{}
  if(reused){progress.done++;progress.reused++;console.log(`reuse ${progress.done}/${cards.length} ${card.slug}`);await saveProgress();continue}
  let success=false,error;
  for(let attempt=1;attempt<=2&&!stopping;attempt++){
   try{await renderCard(card,version,html,renderSignature);success=true;break}catch(e){error=e;console.error(`attempt ${attempt}: ${card.slug}: ${e}`);await closeBrowser()}
  }
  if(!success){progress.failed.push({slug:card.slug,error:String(error||'Interrupted')});await saveProgress();throw error||Error('Interrupted')}
  progress.done++;progress.active=null;await saveProgress();console.log(`rendered ${progress.done}/${cards.length} ${card.slug}`);
 }
 progress.active=null;await saveProgress();
}catch(e){progress.error=String(e);progress.active=null;await saveProgress();console.error(e);process.exitCode=1}
finally{await closeBrowser();for(const child of children)child.kill('SIGTERM');await lock.release()}
