import fs from 'node:fs/promises';
import path from 'node:path';
import {options,atomic} from './common.mjs';
import {validateArticleVideos,validatePublicArticleVideos} from './verify.mjs';
const args=options(),root=process.cwd(),source=path.resolve(args.source||'media/article-videos'),destination=path.resolve(args.out||'public/article-videos');
const now=new Date(args.at||process.env.SITE_BUILD_DATE||Date.now());if(!Number.isFinite(now.getTime()))throw Error('Invalid publication date');
if(source===destination)throw Error('Canonical and public media directories must differ');
const canonical=await validateArticleVideos(root,{directory:source,canonical:args.input||'scripts/article-videos/storyboards.json'});
const entries=canonical.entries.filter(e=>!e.draft&&Date.parse(e.publishDate)<=now.getTime());
let previous={version:1,entries:[]};try{previous=JSON.parse(await fs.readFile(path.join(destination,'manifest.json'),'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
if(previous.version!==1||!Array.isArray(previous.entries))throw Error('Unexpected public video manifest');
const relative=(entry,key)=>{
 const suffix=key==='video'?['video','mp4']:key==='poster'?['posters','jpg']:['html','html'];
 const expected=`/article-videos/${suffix[0]}/${entry.slug}.${suffix[1]}`;
 if(!/^[a-z0-9-]+$/.test(entry.slug)||entry[key]!==expected)throw Error('Unexpected generated media path');
 return expected.slice('/article-videos/'.length);
};
const keep=new Set(entries.flatMap(e=>['video','poster','html'].map(key=>relative(e,key))));
// Only remove known generated files; illustrations, source files and other assets remain intact.
for(const entry of previous.entries)for(const key of ['video','poster','html']){
 const file=relative(entry,key);if(keep.has(file))continue;
 await fs.unlink(path.join(destination,file)).catch(e=>{if(e.code!=='ENOENT')throw e});
}
for(const entry of entries)for(const key of ['video','poster','html']){
 const file=relative(entry,key);await atomic(path.join(destination,file),await fs.readFile(path.join(source,file)));
}
if(entries.length){
 await fs.mkdir(path.join(destination,'assets'),{recursive:true});
 for(const name of ['studio-regular.ttf','studio-bold.ttf','FONT-LICENSE.txt']){
  const src=path.join(source,'assets',name),dst=path.join(destination,'assets',name);
  if(src!==dst)await atomic(dst,await fs.readFile(src));
 }
}
await atomic(path.join(destination,'manifest.json'),JSON.stringify({version:1,materializedAt:now.toISOString(),entries},null,2)+'\n');
await validatePublicArticleVideos(root,{canonicalManifest:canonical,now,directory:destination});
console.log(`${entries.length}/${canonical.entries.length} article videos published at ${now.toISOString()}; future assets remain outside public/.`);
