/** Opt-in alternative frame backend. Writes reviewed candidates only, never publishes them. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {animationHtml} from './motion.mjs';
import {createCanvasAnimation,digest} from './canvas-runtime.mjs';

const args={};
for(const arg of process.argv.slice(2)){
 const match=arg.match(/^--(ids|canvas-module|out|approved-storyboards-sha256)=(.+)$/);
 if(match){if(args[match[1]])throw Error('Duplicate option');args[match[1]]=match[2]}
 else if(arg==='--frames-only'||arg==='--help')args[arg.slice(2)]=true;
 else throw Error('Unknown option: '+arg);
}
if(args.help){console.log('node scripts/pinterest/media/render-canvas.mjs --ids=id,id --canvas-module=/absolute/path/@napi-rs/canvas --out=work/reviewed-videos --approved-storyboards-sha256=SHA [--frames-only]\nWrites candidates, frames and provenance only. No browser or publication. The digest binds approval to JSON.stringify(selected cards in the requested ID order).');process.exit(0)}
const root=process.cwd(),ids=args.ids?.split(','),out=path.resolve(args.out||'work/pinterest-canvas-review');
if(!ids?.length||ids.some(id=>!/^[a-z0-9-]+$/.test(id))||new Set(ids).size!==ids.length)throw Error('Explicit unique IDs required');
if(out===path.resolve('public')||out.startsWith(path.resolve('public')+path.sep))throw Error('Render candidates outside public storage, then review before publication');
const boards=JSON.parse(await fs.readFile('scripts/pinterest/video-storyboards.json','utf8'));
const cards=ids.map(id=>{const matches=boards.filter(card=>card.id===id);if(matches.length!==1)throw Error('Missing or duplicate storyboard: '+id);return matches[0]});
const approvedHash=digest(JSON.stringify(cards));
if(args['approved-storyboards-sha256']!==approvedHash)throw Error('Selected storyboard digest requires explicit editorial approval: '+approvedHash);
await fs.mkdir(out,{recursive:true});
const backendFiles=['scripts/pinterest/media/canvas-runtime.mjs','scripts/pinterest/media/render-canvas.mjs','scripts/pinterest/media/prototype/compose.py'];
const backendHash=digest(Buffer.concat(await Promise.all(backendFiles.map(file=>fs.readFile(file)))));
const legacyVersion=digest(Buffer.concat(await Promise.all(['scripts/pinterest/media/render-video.mjs','scripts/pinterest/media/prototype/compose.py'].map(file=>fs.readFile(file)))));
const run=(command,argv)=>new Promise((resolve,reject)=>{const process=spawn(command,argv,{stdio:['ignore','pipe','pipe']});let stdout='',stderr='';process.stdout.on('data',bytes=>stdout+=bytes);process.stderr.on('data',bytes=>stderr+=bytes);process.once('error',reject);process.once('close',code=>code===0?resolve({stdout,stderr}):reject(Error(command+': '+stderr.slice(-3000))))});
const results=[];
for(const card of cards){
 const folder=path.join(out,card.id);await fs.mkdir(folder,{recursive:false});
 const html=animationHtml(card),animation=await createCanvasAnimation({root,card,html,canvasModule:args['canvas-module']});
 await fs.writeFile(path.join(folder,'animation.html'),html);
 const frames=Math.ceil(animation.duration*24),times=new Set([.1,.7,2]);let start=0;
 for(const scene of card.scenes){for(const t of [start+.12,start+Math.min(1.5,scene.duration/2),start+scene.duration/2,start+scene.duration-.12])times.add(Number(t.toFixed(4)));start+=scene.duration}
 const snapshots=[];
 for(const time of [...times].sort((a,b)=>a-b)){
  const state=animation.draw(time),name=`frame-${time.toFixed(4).replace('.','-')}.jpg`,bytes=await animation.jpeg();
  await fs.writeFile(path.join(folder,name),bytes);snapshots.push({time,state,file:name,sha256:digest(bytes)});
 }
 const initial={id:card.id,approvedStoryboardsSha256:approvedHash,provenance:{...animation.provenance,backendHash},duration:animation.duration,snapshots,newVisualReview:'Pending inspection of candidate frames and transitions; not implied by generation.'};
 await fs.writeFile(path.join(folder,'frames.json'),JSON.stringify(initial,null,2)+'\n');
 if(args['frames-only']){results.push(initial);console.log('frames ready: '+card.id);continue}
 let boundary=0;const boundaries=card.scenes.slice(0,-1).map(scene=>(boundary+=scene.duration)).join(',');
 const wav=path.join(folder,'sound.wav'),audio=path.join(folder,'sound.m4a'),video=path.join(folder,'video.mp4');
 await run(process.env.PINTEREST_PYTHON||'python3',['scripts/pinterest/media/prototype/compose.py','--out='+wav,'--duration='+animation.duration,'--seed='+card.audioSeed,'--boundaries='+boundaries]);
 await run('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',wav,'-af','loudnorm=I=-18:TP=-1.5:LRA=8','-ar','48000','-c:a','aac','-b:a','192k',audio]);
 const encoder=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate','24','-vcodec','mjpeg','-i','pipe:0','-i',audio,'-map','0:v:0','-map','1:a:0','-t',String(frames/24),'-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-threads','2','-c:a','copy','-movflags','+faststart',video],{stdio:['pipe','ignore','pipe']});
 let errors='';encoder.stderr.on('data',bytes=>errors+=bytes);
 const finished=new Promise((resolve,reject)=>{encoder.once('error',reject);encoder.stdin.on('error',reject);encoder.once('close',code=>code===0?resolve():reject(Error('Encoder failed: '+errors.slice(-3000))))});finished.catch(()=>{});
 try{
  for(let frame=0;frame<frames;frame++){
   animation.draw(frame/24);const jpeg=await animation.jpeg();
   if(!encoder.stdin.write(jpeg))await Promise.race([once(encoder.stdin,'drain'),finished.then(()=>{throw Error('Encoder ended early')})]);
   if(frame%240===0)console.log(card.id+': '+Math.round(frame/frames*100)+'%');
  }
  encoder.stdin.end();await finished;
 }catch(error){encoder.kill('SIGTERM');throw error}
 animation.draw(2);const cover=await animation.jpeg(92);await fs.writeFile(path.join(folder,'cover.jpg'),cover);
 const probe=JSON.parse((await run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',video])).stdout),picture=probe.streams.find(stream=>stream.codec_type==='video'),sound=probe.streams.find(stream=>stream.codec_type==='audio');
 if(picture?.codec_name!=='h264'||picture.width!==1080||picture.height!==1920||picture.avg_frame_rate!=='24/1'||!['yuv420p','yuvj420p'].includes(picture.pix_fmt)||sound?.codec_name!=='aac'||sound.channels!==2||sound.sample_rate!=='48000'||Math.abs(Number(picture.duration)-Number(sound.duration))>.12)throw Error('Invalid synchronized MP4 output');
 const audioLog=(await run('ffmpeg',['-hide_banner','-nostats','-i',video,'-vn','-af','ebur128=peak=true,silencedetect=noise=-50dB:d=3','-f','null','-'])).stderr;
 const summary=audioLog.slice(audioLog.lastIndexOf('Summary:')),integrated=Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)?.[1]),peak=Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1]);
 if(!Number.isFinite(integrated)||integrated< -20||integrated> -16||!Number.isFinite(peak)||peak>-.5||/silence_start:/.test(audioLog))throw Error('Audio quality outside the existing acceptance range');
 const legacyInput=Buffer.concat([Buffer.from(legacyVersion),Buffer.from(html),...(card.hero?[await fs.readFile(path.join(root,'public',card.hero))]:[])]);
 const result={...initial,video:{codec:picture.codec_name,pixelFormat:picture.pix_fmt,colorRange:picture.color_range||'unspecified',width:picture.width,height:picture.height,frameRate:picture.avg_frame_rate,duration:Number(probe.format.duration),audio:{codec:sound.codec_name,channels:sound.channels,sampleRate:Number(sound.sample_rate),integratedLufs:integrated,truePeakDb:peak,prolongedSilence:false},styleVersion:2,noVoice:true},sha256:digest(await fs.readFile(video)),coverHash:digest(cover),htmlHash:digest(html),renderedAt:new Date().toISOString(),legacyCompatibilitySourceHash:digest(legacyInput),textOverflow:false,allFramesChecked:frames};
 await fs.writeFile(path.join(folder,'render.json'),JSON.stringify(result,null,2)+'\n');
 await fs.rm(wav);results.push(result);console.log('rendered candidate: '+card.id);
}
await fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2)+'\n');
