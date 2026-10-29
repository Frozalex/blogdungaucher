import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {sha,pipelineHash,preparationHash,scriptDirectory} from './common.mjs';
import {validateArticleVideos} from './verify.mjs';
const exec=promisify(execFile);

async function fixture(){
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'article-video-publication-'));
 const put=async(name,bytes)=>{const file=path.join(root,name);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,bytes)};
 const slug='publication-fixture',sourceFile=`src/content/blog/science/${slug}.md`;
 const source='---\ntitle: Test de publication\npublishDate: "2027-01-15T14:00:00Z"\ncategory: science\nnoindex: true\n---\nTexte source de test.\n';
 const summary={slug,category:'science',sourceFile,sourceSha256:sha(source),scenes:[]};
 const generator=await preparationHash();
 const html='<html lang="fr"><body>Fixture de contrôle des dates<script>\nconst card='+JSON.stringify({preparationHash:generator,scenes:[]})+';\n</script></body></html>';
 // Sentinel bytes exercise publication and fingerprint handling. Actual MP4 codecs
 // and sound are tested by render.mjs with ffprobe/ffmpeg, not by these fixtures.
 const video=Buffer.from('test-video-bytes'),poster=Buffer.from('test-poster-bytes'),font=Buffer.from('test-font'),logo='<svg xmlns="http://www.w3.org/2000/svg"></svg>';
 const entry={slug,title:'Test de publication',category:'science',sourceFile,sourceSha256:sha(source),summarySha256:sha(JSON.stringify(summary)),preparationHash:generator,publishDate:'2027-01-15T14:00:00.000Z',draft:false,noindex:true,video:`/article-videos/video/${slug}.mp4`,poster:`/article-videos/posters/${slug}.jpg`,html:`/article-videos/html/${slug}.html`,width:1920,height:1080,fps:24,duration:90,codec:'h264',sha256:sha(video),posterSha256:sha(poster),htmlSha256:sha(html),renderSignature:sha(await pipelineHash()+html),fonts:{regular:sha(font),bold:sha(font)},logoSha256:sha(logo),scenes:[],hero:null,layoutSignature:'unique-test-composition',audio:{codec:'aac',channels:2,sampleRate:48000,integratedLufs:-18,truePeakDb:-1.5,prolongedSilence:false},noVoiceOver:true,textOverflow:false};
 await put(sourceFile,source);await put('scripts/article-videos/storyboards.json',JSON.stringify([summary]));
 await put('public/images/logo-transparent.svg',logo);
 await put('media/article-videos/manifest.json',JSON.stringify({version:1,entries:[entry]}));
 for(const [file,bytes]of [[`video/${slug}.mp4`,video],[`posters/${slug}.jpg`,poster],[`html/${slug}.html`,html],['assets/studio-regular.ttf',font],['assets/studio-bold.ttf',font],['assets/FONT-LICENSE.txt','test-license']])await put('media/article-videos/'+file,bytes);
 await put('public/article-videos/assets/keep.txt','keep');await put('public/article-videos/unrelated.txt','keep');
 const run=at=>exec(process.execPath,[path.join(scriptDirectory,'materialize.mjs'),'--at='+at],{cwd:root});
 const manifest=async()=>JSON.parse(await fs.readFile(path.join(root,'public/article-videos/manifest.json'),'utf8'));
 return{root,entry,run,manifest,put,cleanup:()=>fs.rm(root,{recursive:true,force:true})};
}
test('future videos stay private, appear at the article publication time, and survive noindex',async()=>{
 const f=await fixture();try{
  await f.run('2027-01-15T13:59:59Z');assert.equal((await f.manifest()).entries.length,0);await assert.rejects(fs.access(path.join(f.root,'public'+f.entry.video)),{code:'ENOENT'});
  await f.run('2027-01-15T14:00:00Z');assert.equal((await f.manifest()).entries.length,1);await fs.access(path.join(f.root,'public'+f.entry.video));
  await f.run('2027-01-15T13:59:59Z');assert.equal((await f.manifest()).entries.length,0);for(const key of ['video','poster','html'])await assert.rejects(fs.access(path.join(f.root,'public'+f.entry[key])),{code:'ENOENT'});
  assert.equal(await fs.readFile(path.join(f.root,'public/article-videos/assets/keep.txt'),'utf8'),'keep');assert.equal(await fs.readFile(path.join(f.root,'public/article-videos/unrelated.txt'),'utf8'),'keep');
 }finally{await f.cleanup()}
});
test('a changed media binary blocks materialization',async()=>{
 const f=await fixture();try{
  await f.put('media/article-videos/video/publication-fixture.mp4','tampered');
  await assert.rejects(f.run('2027-01-16T00:00:00Z'),/Article video asset changed/);
  await assert.rejects(fs.access(path.join(f.root,'public'+f.entry.video)),{code:'ENOENT'});
 }finally{await f.cleanup()}
});

test('a changed article blocks publication of its obsolete video',async()=>{
 const f=await fixture();try{
  await fs.appendFile(path.join(f.root,f.entry.sourceFile),'Nouvelle précision importante.\n');
  await assert.rejects(f.run('2027-01-16T00:00:00Z'),/Article changed; review the summary video/);
  await assert.rejects(fs.access(path.join(f.root,'public'+f.entry.video)),{code:'ENOENT'});
 }finally{await f.cleanup()}
});
test('a modified published transcript is rejected even with the original summary hash',async()=>{
 const f=await fixture();try{
  const changed={...f.entry,scenes:[{heading:'Intrusion',text:'Texte absent du résumé canonique.'}]};
  await f.put('media/article-videos/manifest.json',JSON.stringify({version:1,entries:[changed]}));
  await assert.rejects(validateArticleVideos(f.root),/Published transcript differs/);
 }finally{await f.cleanup()}
});
test('verification rejects an obsolete preparation even with freshly signed render metadata',async()=>{
 const f=await fixture();try{
  const changed={...f.entry,preparationHash:'obsolete-generator'};
  await f.put('media/article-videos/manifest.json',JSON.stringify({version:1,entries:[changed]}));
  await assert.rejects(validateArticleVideos(f.root),/Animation generator changed; prepare HTML again/);
 }finally{await f.cleanup()}
});
test('a modified animation transcript is rejected even after recomputing its file fingerprints',async()=>{
 const f=await fixture();try{
  const html='const card='+JSON.stringify({preparationHash:f.entry.preparationHash,scenes:[{heading:'Intrusion',text:'Texte absent du résumé canonique.'}]})+';\n';
  const changed={...f.entry,htmlSha256:sha(html),renderSignature:sha(await pipelineHash()+html)};
  await f.put('media/article-videos/html/publication-fixture.html',html);
  await f.put('media/article-videos/manifest.json',JSON.stringify({version:1,entries:[changed]}));
  await assert.rejects(validateArticleVideos(f.root),/Animation transcript differs/);
 }finally{await f.cleanup()}
});
