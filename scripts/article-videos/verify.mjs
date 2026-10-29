import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseFrontmatter} from '@astrojs/markdown-remark';
import {sha,pipelineHash,preparationHash,assertPreparation,preparedCardFromHtml,options} from './common.mjs';

/** Build-time validation of rendered, published summaries. No browser or encoder. */
export async function validateArticleVideos(root=process.cwd(),{directory='media/article-videos',canonical='scripts/article-videos/storyboards.json'}={}){
 const out=path.resolve(root,directory),file=path.join(out,'manifest.json');
 const manifest=JSON.parse(await fs.readFile(file,'utf8'));
 if(manifest.version!==1||!Array.isArray(manifest.entries))throw Error('Invalid article video manifest');
 if(manifest.entries.length===0)return manifest;
 const summaries=new Map(JSON.parse(await fs.readFile(path.resolve(root,canonical),'utf8')).map(s=>[s.slug,s]));
 const version=await pipelineHash(),generator=await preparationHash(),slugs=new Set(),compositions=new Set();
 for(const entry of manifest.entries){
  if(!/^[a-z0-9-]+$/.test(entry.slug)||slugs.has(entry.slug))throw Error('Invalid/duplicate article video');slugs.add(entry.slug);
  if(entry.sourceFile!==`src/content/blog/${entry.category}/${entry.slug}.md`)throw Error('Unexpected article source');
  const sourceBytes=await fs.readFile(path.resolve(root,entry.sourceFile));
  if(sha(sourceBytes)!==entry.sourceSha256)throw Error('Article changed; review the summary video: '+entry.slug);
  const metadata=parseFrontmatter(sourceBytes.toString('utf8')).frontmatter;
  if(entry.publishDate!==new Date(metadata.publishDate).toISOString()||entry.draft!==(metadata.draft===true)||entry.noindex!==(metadata.noindex===true))throw Error('Publication metadata differs from the article: '+entry.slug);
  if(!summaries.has(entry.slug)||sha(JSON.stringify(summaries.get(entry.slug)))!==entry.summarySha256)throw Error('Summary changed; regenerate video: '+entry.slug);
  const transcript=summaries.get(entry.slug).scenes.map(({heading,text})=>({heading,text}));
  if(JSON.stringify(entry.scenes)!==JSON.stringify(transcript))throw Error('Published transcript differs from canonical summary: '+entry.slug);
  if(entry.width!==1920||entry.height!==1080||entry.fps!==24||!Number.isFinite(entry.duration)||entry.duration<42||entry.duration>192||entry.codec!=='h264'||entry.audio?.codec!=='aac'||entry.audio.channels!==2||entry.audio.sampleRate!==48000||entry.noVoiceOver!==true||entry.textOverflow!==false)throw Error('Unverified article video format: '+entry.slug);
  if(!Number.isFinite(entry.audio.integratedLufs)||!Number.isFinite(entry.audio.truePeakDb)||entry.audio.integratedLufs< -20||entry.audio.integratedLufs> -16||entry.audio.truePeakDb> -.5||entry.audio.prolongedSilence!==false)throw Error('Unverified article soundtrack: '+entry.slug);
  if(!entry.layoutSignature||compositions.has(entry.layoutSignature))throw Error('Duplicate article video composition');compositions.add(entry.layoutSignature);
  const files=[['video',`/article-videos/video/${entry.slug}.mp4`,'sha256'],['poster',`/article-videos/posters/${entry.slug}.jpg`,'posterSha256'],['html',`/article-videos/html/${entry.slug}.html`,'htmlSha256']];
  for(const [field,expected,hashField]of files){
   if(entry[field]!==expected)throw Error('Unexpected video asset path');
   const bytes=await fs.readFile(path.join(out,expected.slice('/article-videos/'.length)));
   if(sha(bytes)!==entry[hashField])throw Error('Article video asset changed: '+expected);
   if(field==='html'){
    assertPreparation(entry,bytes.toString('utf8'),generator);
    if(JSON.stringify(preparedCardFromHtml(bytes.toString('utf8')).scenes.map(({heading,text})=>({heading,text})))!==JSON.stringify(transcript))throw Error('Animation transcript differs from canonical summary: '+entry.slug);
    if(sha(version+bytes.toString('utf8'))!==entry.renderSignature)throw Error('Animation pipeline changed; regenerate video: '+entry.slug);
    if(/[\p{Extended_Pictographic}\u2654-\u265f\uFE0F\u20E3]/u.test(bytes.toString('utf8')))throw Error('Emoji or chess glyph in animation');
   }
  }
  for(const key of ['regular','bold'])if(sha(await fs.readFile(path.join(out,'assets',`studio-${key}.ttf`)))!==entry.fonts?.[key])throw Error('Animation font changed: '+entry.slug);
  if(sha(await fs.readFile(path.join(root,'public/images/logo-transparent.svg')))!==entry.logoSha256)throw Error('Logo changed; regenerate video: '+entry.slug);
  if(entry.hero&&sha(await fs.readFile(path.join(root,'public',entry.hero.src)))!==entry.hero.sha256)throw Error('Article illustration changed; regenerate video: '+entry.slug);
 }
 return manifest;
}
export async function validatePublicArticleVideos(root=process.cwd(),{canonicalManifest,now=new Date(process.env.SITE_BUILD_DATE||Date.now()),directory='public/article-videos'}={}){
 const canonical=canonicalManifest||await validateArticleVideos(root);
 const out=path.resolve(root,directory);
 const publicManifest=JSON.parse(await fs.readFile(path.join(out,'manifest.json'),'utf8'));
 const expected=canonical.entries.filter(e=>!e.draft&&Date.parse(e.publishDate)<=now.getTime());
 if(publicManifest.version!==1||!Array.isArray(publicManifest.entries)||JSON.stringify(publicManifest.entries)!==JSON.stringify(expected))throw Error('Published video manifest differs from the eligible canonical entries');
 for(const e of canonical.entries){
  const eligible=expected.some(x=>x.slug===e.slug);
  for(const [key,hashKey]of [['video','sha256'],['poster','posterSha256'],['html','htmlSha256']]){
   const destination=path.join(out,e[key].slice('/article-videos/'.length));
   if(eligible){if(sha(await fs.readFile(destination))!==e[hashKey])throw Error('Published video file changed: '+e.slug)}
   else{try{await fs.access(destination);throw Error('Future video leaked into public assets: '+e.slug)}catch(error){if(error.code!=='ENOENT')throw error}}
  }
 }
 return publicManifest;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const args=options();
 const canonical=await validateArticleVideos(process.cwd(),{directory:args.out||'media/article-videos',canonical:args.input||'scripts/article-videos/storyboards.json'});
 let published=null;if(!args.out&&!args.input)published=await validatePublicArticleVideos(process.cwd(),{canonicalManifest:canonical});
 console.log(`${canonical.entries.length} canonical article video(s) verified${published?`, ${published.entries.length} published`:''}: sources, summaries, binary files, sound, logo and compositions.`);
}
