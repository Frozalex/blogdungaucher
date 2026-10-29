import {animationHtml} from './motion.mjs';
import fs from'node:fs';import path from'node:path';import{createHash}from'node:crypto';
export function validateMediaAssets(root,formats){
 const boards=new Map(JSON.parse(fs.readFileSync(path.join(root,'scripts/pinterest/video-storyboards.json'))).map(c=>[c.id,c]));
 const entries=JSON.parse(fs.readFileSync(path.join(root,'scripts/pinterest/media-manifest.json'))),seen=new Set(),sourceHashes=new Map();
 for(const entry of entries){
  if(!['pdf','video'].includes(entry.format)||formats[entry.id]!==entry.format||seen.has(entry.id))throw Error('Unexpected/duplicate mixed media asset');seen.add(entry.id);
  const suffix=entry.format==='pdf'?'pdf':'mp4',expected=`public/pinterest-media/${entry.format==='pdf'?'pdf':'video'}/${entry.id}.${suffix}`;
  if(entry.file!==expected||entry.cover!==`public/pinterest-media/covers/${entry.id}.jpg`)throw Error('Invalid media asset path');
  for(const [file,hash]of [[entry.file,entry.sha256],[entry.cover,entry.coverHash]]){
   if(createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')!==hash)throw Error(`Media changed; regenerate the manifest: ${entry.id}`);
  }
  if(entry.format==='video'){
   if(entry.video?.styleVersion!==2||entry.video?.audio?.codec!=='aac'||entry.video.audio.channels!==2||entry.video.audio.sampleRate!==48000||entry.video.noVoice!==true||entry.video.duration<40||entry.video.duration>90)throw Error(`Video soundtrack/style not verified: ${entry.id}`);
   if(entry.html!==`public/pinterest-media/html/${entry.id}.html`||createHash('sha256').update(fs.readFileSync(path.join(root,entry.html))).digest('hex')!==entry.htmlHash)throw Error(`Animation changed; review the video: ${entry.id}`);
   const html=fs.readFileSync(path.join(root,entry.html),'utf8');
   if(html!==animationHtml(boards.get(entry.id)))throw Error(`Storyboard/template changed; regenerate the video: ${entry.id}`);
   if(/[\p{Extended_Pictographic}\u2654-\u265f\uFE0F\u20E3]/u.test(html))throw Error(`Emoji or font-dependent chess piece in video: ${entry.id}`);
  }
  if(!/^src\/content\/blog\/(science|esprit|societe)\/[a-z0-9-]+\.md$/.test(entry.sourceFile))throw Error('Invalid media source path');
  if(!sourceHashes.has(entry.sourceFile))sourceHashes.set(entry.sourceFile,createHash('sha256').update(fs.readFileSync(path.join(root,entry.sourceFile))).digest('hex'));
  if(sourceHashes.get(entry.sourceFile)!==entry.sourceHash)throw Error(`Article changed; review the linked media: ${entry.id}`);
 }
 for(const [id,format]of Object.entries(formats))if(format!=='image'&&!seen.has(id))throw Error(`Missing media: ${id}`);
 return entries;
}
