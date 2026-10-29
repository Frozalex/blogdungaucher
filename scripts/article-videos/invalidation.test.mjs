import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {makeCard,animationHtml,sha,pipelineHash,preparationHash,assertPreparation,scriptDirectory} from './common.mjs';
const exec=promisify(execFile);

test('external font changes invalidate HTML and cannot reuse a matching old MP4 cache',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'article-video-font-'));
 try{
  const put=async(name,value)=>{const file=path.join(root,name);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,value)};
  const source='---\ntitle: Test des polices\ncategory: science\npublishDate: "2020-01-01"\n---\nArticle de test.\n';
  const sourceFile='src/content/blog/science/test-polices.md';
  await put(sourceFile,source);await put('public/images/logo-transparent.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"></svg>');
  for(const name of ['regular','bold'])await put(`public/article-videos/assets/studio-${name}.ttf`,'font-before');
  const roles=['hook','idea','idea','idea','nuance','closing'];
  const summary={slug:'test-polices',category:'science',title:'Test des polices',sourceFile,sourceSha256:sha(source),scenes:roles.map(role=>({role,heading:'Un repère de test',text:'Ce texte de démonstration vérifie le comportement du générateur et protège les ressources externes utilisées pendant la préparation et le rendu.',sourceHeading:'Texte de test',layout:'thesis'}))};
  const before=await makeCard(summary,root),htmlBefore=await animationHtml(before,root),version=await pipelineHash();
  await put('public/article-videos/assets/studio-regular.ttf','font-after');
  const after=await makeCard(summary,root),htmlAfter=await animationHtml(after,root);
  assert.notEqual(before.fonts.regular,after.fonts.regular);
  assert.notEqual(sha(version+htmlBefore),sha(version+htmlAfter),'Preparing again must invalidate the encoded render signature');
  const out=path.join(root,'media/article-videos'),video=Buffer.from('cached-video'),poster=Buffer.from('cached-poster');
  const card={...before,hero:null,compositionSignature:'thesis-test',html:'html/test-polices.html',htmlSha256:sha(htmlBefore),video:'video/test-polices.mp4',poster:'posters/test-polices.jpg'};
  await put('media/article-videos/storyboards.json',JSON.stringify([card]));
  await put('media/article-videos/html/test-polices.html',htmlBefore);
  await put('media/article-videos/video/test-polices.mp4',video);await put('media/article-videos/posters/test-polices.jpg',poster);
  await put('media/article-videos/assets/studio-regular.ttf','font-after');await put('media/article-videos/assets/studio-bold.ttf','font-before');
  await put(`work/article-videos/render-${sha(out).slice(0,12)}/test-polices.json`,JSON.stringify({renderSignature:sha(version+htmlBefore),sha256:sha(video),posterSha256:sha(poster)}));
  await assert.rejects(exec(process.execPath,[path.join(scriptDirectory,'render.mjs'),'--out='+out],{cwd:root,env:{...process.env,ARTICLE_VIDEO_CHROME:'/nonexistent/no-browser-should-launch'}}),error=>error.code===1);
  const progress=JSON.parse(await fs.readFile(path.join(root,'work/article-videos/render-progress.json'),'utf8'));
  assert.match(progress.error,/Animation font changed: regular/);
  assert.equal(progress.reused,0);assert.equal(progress.done,0);
 }finally{await fs.rm(root,{recursive:true,force:true})}
});

test('each HTML generator input invalidates an existing preparation',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'article-video-generator-'));
 try{
  for(const name of ['common.mjs','prepare.mjs','studio.html'])await fs.copyFile(path.join(scriptDirectory,name),path.join(root,name));
  const before=await preparationHash(root),card={slug:'test-generation',preparationHash:before};
  const html='const card='+JSON.stringify(card)+';\n';
  assert.doesNotThrow(()=>assertPreparation(card,html,before));
  for(const name of ['common.mjs','prepare.mjs','studio.html']){
   const original=await fs.readFile(path.join(root,name));
   await fs.appendFile(path.join(root,name),'\n/* modified generator fixture */\n');
   const after=await preparationHash(root);assert.notEqual(after,before,name+' must invalidate preparation');
   assert.throws(()=>assertPreparation(card,html,after),/prepare HTML again/);
   // Updating only plan metadata must not make stale HTML valid.
   assert.throws(()=>assertPreparation({...card,preparationHash:after},html,after),/prepare HTML again/);
   await fs.writeFile(path.join(root,name),original);
  }
 }finally{await fs.rm(root,{recursive:true,force:true})}
});

test('render rejects old prepared HTML before launching a browser or reusing an MP4',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'article-video-old-html-'));
 try{
  const put=async(name,value)=>{const file=path.join(root,name);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,value)};
  const sourceFile='src/content/blog/science/test-generation.md',source='Old generator fixture',logo='<svg></svg>',font='fixture-font';
  await put(sourceFile,source);await put('public/images/logo-transparent.svg',logo);
  const card={slug:'test-generation',sourceFile,sourceSha256:sha(source),logoSha256:sha(logo),fonts:{regular:sha(font),bold:sha(font)},publishDate:'2020-01-01T00:00:00Z',draft:false,preparationHash:'old-generator',html:'html/test-generation.html',video:'video/test-generation.mp4',poster:'posters/test-generation.jpg'};
  const html='const card='+JSON.stringify(card)+';\n';card.htmlSha256=sha(html);
  await put('media/article-videos/storyboards.json',JSON.stringify([card]));await put('media/article-videos/'+card.html,html);
  for(const name of ['regular','bold'])await put(`media/article-videos/assets/studio-${name}.ttf`,font);
  await assert.rejects(exec(process.execPath,[path.join(scriptDirectory,'render.mjs')],{cwd:root,env:{...process.env,ARTICLE_VIDEO_CHROME:'/nonexistent/no-browser-should-launch'}}),error=>error.code===1);
  const progress=JSON.parse(await fs.readFile(path.join(root,'work/article-videos/render-progress.json'),'utf8'));
  assert.match(progress.error,/Animation generator changed; prepare HTML again/);assert.equal(progress.done,0);assert.equal(progress.reused,0);
 }finally{await fs.rm(root,{recursive:true,force:true})}
});
