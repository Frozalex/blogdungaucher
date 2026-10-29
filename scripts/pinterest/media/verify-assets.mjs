import {animationHtml} from './motion.mjs';
import fs from'node:fs';import path from'node:path';import{createHash}from'node:crypto';import{execFileSync}from'node:child_process';import sharp from'sharp';
const data=JSON.parse(fs.readFileSync('work/pinterest-media/data.json')),root=process.cwd(),assets=[],seen=new Set();
const boards=new Map(JSON.parse(fs.readFileSync('scripts/pinterest/video-storyboards.json')).map(c=>[c.id,c]));
const pipeline=createHash('sha256');for(const f of ['scripts/pinterest/media/render-video.mjs','scripts/pinterest/media/prototype/compose.py'])pipeline.update(fs.readFileSync(f));const version=pipeline.digest('hex');
for(const card of data.filter(c=>c.format!=='image')){
 const relative=`public/pinterest-media/${card.format==='pdf'?'pdf':'video'}/${card.id}.${card.format==='pdf'?'pdf':'mp4'}`,bytes=fs.readFileSync(relative),hash=createHash('sha256').update(bytes).digest('hex');
 if(seen.has(hash))throw Error('Duplicate asset '+card.id);seen.add(hash);
 const cover=`public/pinterest-media/covers/${card.id}.jpg`,image=await sharp(cover).metadata();
 if(card.format==='pdf'&&(image.width!==1000||image.height!==1500||bytes.subarray(0,5).toString()!=='%PDF-'))throw Error('Invalid PDF '+card.id);
 let video,html,htmlHash;
 if(card.format==='video'){
  const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',relative],{encoding:'utf8'})),stream=probe.streams.find(s=>s.codec_type==='video'),audio=probe.streams.find(s=>s.codec_type==='audio');
  // Both labels describe 8-bit YUV 4:2:0; yuvj420p signals full-range JPEG-derived frames.
  if(stream.codec_name!=='h264'||stream.width!==1080||stream.height!==1920||!['yuv420p','yuvj420p'].includes(stream.pix_fmt)||Number(probe.format.duration)<40||Number(probe.format.duration)>90)throw Error('Invalid MP4 '+card.id);
  if(audio?.codec_name!=='aac'||audio.channels!==2||audio.sample_rate!=='48000'||Math.abs(Number(audio.duration)-Number(stream.duration))>.12)throw Error('Missing/invalid synchronized soundtrack '+card.id);
  if(image.width!==1080||image.height!==1920)throw Error('Invalid video thumbnail '+card.id);
  const board=boards.get(card.id),stamp=JSON.parse(fs.readFileSync(`work/pinterest-media/rendered/${card.id}.json`));
  html=`public/pinterest-media/html/${card.id}.html`;const htmlBytes=fs.readFileSync(html);htmlHash=createHash('sha256').update(htmlBytes).digest('hex');
  if(htmlBytes.toString('utf8')!==animationHtml(board))throw Error('Animation must be regenerated from the current storyboard/template: '+card.id);
  const hash=createHash('sha256').update(version).update(htmlBytes);if(board.hero)hash.update(fs.readFileSync('public'+board.hero));
  if(stamp.sourceHash!==hash.digest('hex')||stamp.pipelineVersion!==2||stamp.textOverflow!==false)throw Error('Video must be rerendered from current animation: '+card.id);
  if(Math.abs(stamp.duration-Number(stream.duration))>.05)throw Error('Rendered timeline mismatch: '+card.id);
  video={codec:stream.codec_name,pixelFormat:stream.pix_fmt,colorRange:stream.color_range||'unspecified',width:stream.width,height:stream.height,frameRate:stream.avg_frame_rate,duration:Number(probe.format.duration),audio:{codec:audio.codec_name,channels:audio.channels,sampleRate:Number(audio.sample_rate)},styleVersion:2,noVoice:true};
 }
 const sourceFile=card.source.file,sourceHash=createHash('sha256').update(fs.readFileSync(sourceFile)).digest('hex');
 assets.push({id:card.id,format:card.format,file:relative,bytes:bytes.length,sha256:hash,sourceFile,sourceHash,cover,coverHash:createHash('sha256').update(fs.readFileSync(cover)).digest('hex'),...(video?{video,html,htmlHash}:{})});
}
if(assets.filter(a=>a.format==='pdf').length!==243||assets.filter(a=>a.format==='video').length!==243)throw Error('Incomplete assets');
fs.writeFileSync('scripts/pinterest/media-manifest.json',JSON.stringify(assets,null,2)+'\n');console.log('243 PDFs and 243 H.264 MP4s with synchronized stereo AAC verified; all covers valid; all assets distinct.');
