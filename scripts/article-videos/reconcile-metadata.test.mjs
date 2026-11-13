import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {makeCard,animationHtml,sha,pipelineHash,preparedCardFromHtml} from './common.mjs';
import {planMetadataReconciliation,applyMetadataReconciliation,assertMetadataOnly,visualInputsHash} from './reconcile-metadata.mjs';
import {validateArticleVideos} from './verify.mjs';

async function fixture(){
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'article-video-metadata-'));
 const put=async(file,content)=>{await fs.mkdir(path.dirname(path.join(root,file)),{recursive:true});await fs.writeFile(path.join(root,file),content)};
 const slug='reviewed-article',sourceFile=`src/content/blog/science/${slug}.md`;
 const source=title=>`---\ntitle: "${title}"\ncategory: science\npublishDate: "2020-01-01"\nheroImage:\n  src: /images/test-hero.svg\n  alt: Illustration conservée\n---\n`;
 const before=source('Ancien titre')+'Texte initial.\n',after=source('Nouveau titre')+'Texte enrichi sans contredire les six scènes déjà relues.\n';
 await put(sourceFile,before);
 await put('public/images/logo-transparent.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"></svg>');
 await put('public/images/test-hero.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path d="M0 0L1 1"/></svg>');
 for(const weight of ['regular','bold'])for(const directory of ['public','media'])await put(`${directory}/article-videos/assets/studio-${weight}.ttf`,'fixture-font-'+weight);
 const summary={slug,category:'science',title:'Ancien titre',sourceFile,sourceSha256:sha(before),scenes:['hook','idea','idea','idea','nuance','closing'].map((role,index)=>({role,heading:'Idée vérifiable '+index,text:'Ce texte de démonstration examine une idée et ses limites dans une position concrète, sans attribuer un bénéfice universel aux joueurs ni inventer de résultat.',sourceHeading:'Introduction',layout:['hero-split','thesis','comparison','steps','question','takeaway'][index]})),visualIntent:'Une composition explicitement conservée.'};
 const card=await makeCard(summary,root);card.scenes=card.scenes.map((scene,i)=>({...scene,variant:i%2}));card.compositionSignature=card.scenes.map(scene=>`${scene.layout}:${scene.variant}`).join('|');
 const html=await animationHtml(card,root),{hero,...metadata}=card,mediaHero={...hero};delete mediaHero.uri;
 const prepared={...metadata,hero:mediaHero,html:`html/${slug}.html`,htmlSha256:sha(html),video:`video/${slug}.mp4`,poster:`posters/${slug}.jpg`,status:'animation-prepared',audio:'original-music-and-effects-no-voice'};
 const video=Buffer.from('small-video-sentinel'),poster=Buffer.from('small-poster-sentinel'),version=await pipelineHash();
 const entry={slug,title:card.title,category:card.category,publishDate:card.publishDate,draft:false,noindex:false,sourceFile,sourceSha256:card.sourceSha256,summarySha256:card.summarySha256,preparationHash:card.preparationHash,fonts:card.fonts,logoSha256:card.logoSha256,video:`/article-videos/${prepared.video}`,poster:`/article-videos/${prepared.poster}`,html:`/article-videos/${prepared.html}`,duration:card.duration,width:1920,height:1080,fps:24,codec:'h264',sha256:sha(video),posterSha256:sha(poster),htmlSha256:sha(html),renderSignature:sha(version+html),hero:mediaHero,scenes:card.scenes.map(({heading,text})=>({heading,text})),layoutSignature:card.compositionSignature,audio:{codec:'aac',channels:2,sampleRate:48000,integratedLufs:-18,truePeakDb:-1.5,prolongedSilence:false},noVoiceOver:true,textOverflow:false,renderedAt:'2026-10-29T20:00:00.000Z'};
 await put('scripts/article-videos/storyboards.json',JSON.stringify([summary],null,2)+'\n');
 await put('media/article-videos/storyboards.json',JSON.stringify([prepared],null,2)+'\n');
 await put('media/article-videos/manifest.json',JSON.stringify({version:1,updatedAt:'2026-10-29T20:00:00.000Z',entries:[entry]},null,2)+'\n');
 await put('media/article-videos/'+prepared.html,html);await put('media/article-videos/'+prepared.video,video);await put('media/article-videos/'+prepared.poster,poster);
 await put('media/article-videos/index.html',`<!doctype html><main><article><h2>Ancien titre</h2><a href="html/${slug}.html">Animation</a></article><article><h2>Autre titre</h2><a href="html/unreviewed.html">Animation</a></article></main>`);
 await put(sourceFile,after);
 const reportPath='docs/review.md',report=`# Explicit editorial review\n\nThe six scenes remain accurate; no fresh frame or audio review was performed.\n\n| Slug | Old source | New reviewed source |\n| --- | --- | --- |\n| \`${slug}\` | \`${sha(before)}\` | \`${sha(after)}\` |\n`;
 await put(reportPath,report);
 return {root,slug,sourceFile,before,after,summary,card,prepared,entry,html,reportPath,put,video,poster,version,cleanup:()=>fs.rm(root,{recursive:true,force:true}),plan:()=>planMetadataReconciliation(root,{reviewedSlugs:[slug],reviewReport:reportPath,now:new Date('2026-11-13T12:00:00Z')})};
}

test('old signed source metadata can be reconciled without its former article bytes or a re-render',async()=>{
 const f=await fixture();
 try{
  await assert.rejects(validateArticleVideos(f.root),/Article changed/);
  const plan=await f.plan();
  assert.equal(await fs.readFile(path.join(f.root,'media/article-videos/'+f.prepared.html),'utf8'),f.html,'planning is read-only');
  const html=plan.writes.find(write=>write.file.endsWith('/'+f.slug+'.html')).content,card=preparedCardFromHtml(html);
  assert.equal(card.sourceSha256,sha(f.after));assert.equal(card.title,'Nouveau titre');
  assertMetadataOnly(f.card,card);assert.equal(visualInputsHash(f.card),visualInputsHash(card));
  await applyMetadataReconciliation(plan);
  const manifest=await validateArticleVideos(f.root),entry=manifest.entries[0];
  const canonical=JSON.parse(await fs.readFile(path.join(f.root,'scripts/article-videos/storyboards.json'),'utf8'))[0];
  assert.equal(entry.summarySha256,sha(JSON.stringify(canonical)),'use the unchanged canonical JSON hash formula');
  assert.equal(entry.htmlSha256,sha(html));
  assert.equal(entry.renderSignature,sha(f.version+html),'use the unchanged pipeline hash + literal HTML formula');
  assert.notEqual(entry.renderSignature,sha(f.version+sha(html)),'do not hash a digest instead of HTML bytes');
  assert.deepEqual(await fs.readFile(path.join(f.root,'media/article-videos/'+f.prepared.video)),f.video);
  assert.deepEqual(await fs.readFile(path.join(f.root,'media/article-videos/'+f.prepared.poster)),f.poster);
  for(const key of ['sha256','posterSha256','renderedAt','duration','audio','scenes','layoutSignature'])assert.deepEqual(entry[key],f.entry[key],key+' remains untouched');
  assert.deepEqual(entry.metadataReview[0].visualInputs,{before:visualInputsHash(f.card),after:visualInputsHash(card)});
  assert.equal(entry.metadataReview[0].source.before,sha(f.before));assert.equal(entry.metadataReview[0].source.after,sha(f.after));
  assert.equal(entry.metadataReview[0].report.sha256,sha(await fs.readFile(path.join(f.root,f.reportPath))));
  assert.match(entry.metadataReview[0].visualValidation,/No new frame/);
  const gallery=await fs.readFile(path.join(f.root,'media/article-videos/index.html'),'utf8');
  assert.ok(gallery.includes('<h2>Nouveau titre</h2>'));assert.ok(gallery.includes('<h2>Autre titre</h2>'));
  await assert.rejects(f.plan(),/Source does not match|No metadata reconciliation/,'the same review is not silently reapplied');
 }finally{await f.cleanup()}
});

test('only source hash, title and summary hash may change on the embedded card',async()=>{
 const f=await fixture();
 try{
  const permitted={...f.card,title:'Updated',sourceSha256:'a'.repeat(64),summarySha256:'b'.repeat(64)};assertMetadataOnly(f.card,permitted);
  const mutations=[
   card=>card.scenes[0].heading+=' changed',card=>card.scenes[0].text+=' changed',card=>card.scenes[0].sourceHeading='Another heading',
   card=>card.scenes[0].layout='thesis',card=>card.scenes[0].start+=1,card=>card.scenes[0].duration+=1,card=>card.scenes[0].variant=1,
   card=>card.duration+=1,card=>card.hero.sha256='c'.repeat(64),card=>card.hero.alt+=' changed',card=>card.hero.uri+='changed',
   card=>card.fonts.regular='c'.repeat(64),card=>card.compositionSeed++,card=>card.audioSeed++,card=>card.accent='#000',
   card=>card.logoSha256='d'.repeat(64),card=>card.width=1280,card=>card.fps=30,card=>card.publishDate='2030-01-01',card=>card.extra='new unknown field',
  ];
  for(const mutate of mutations){const changed=structuredClone(f.card);mutate(changed);assert.throws(()=>assertMetadataOnly(f.card,changed),/Visual or protected/)}
 }finally{await f.cleanup()}
});

test('the exact reviewed report, explicit slug list and unchanged old summary are required',async()=>{
 const f=await fixture();
 try{
  await assert.rejects(planMetadataReconciliation(f.root,{reviewReport:f.reportPath}),/reviewed-slugs/);
  await assert.rejects(planMetadataReconciliation(f.root,{reviewedSlugs:[f.slug]}),/report/);
  await assert.rejects(planMetadataReconciliation(f.root,{reviewedSlugs:[f.slug,f.slug],reviewReport:f.reportPath}),/unique/);
  await assert.rejects(planMetadataReconciliation(f.root,{reviewedSlugs:['unreviewed'],reviewReport:f.reportPath}),/Missing complete/);
  await f.put(f.sourceFile,f.after+'Further unreviewed edit.\n');await assert.rejects(f.plan(),/Source does not match/);
  await f.put(f.sourceFile,f.after);
  const changed=structuredClone(f.summary);changed.scenes[0].text+=' Une idée non revue.';
  await f.put('scripts/article-videos/storyboards.json',JSON.stringify([changed]));await assert.rejects(f.plan(),/Old summary is not/);
 }finally{await f.cleanup()}
});

test('asset changes and publication metadata changes require a real preparation/render review',async()=>{
 const f=await fixture();
 try{
  await f.put('public/article-videos/assets/studio-regular.ttf','changed-font');await assert.rejects(f.plan(),/font changed/);
  await f.put('public/article-videos/assets/studio-regular.ttf','fixture-font-regular');
  await f.put('public/images/test-hero.svg','changed-hero');await assert.rejects(f.plan(),/Hero changed/);
 }finally{await f.cleanup()}
 const g=await fixture();
 try{
  const changed=g.after.replace('2020-01-01','2020-01-02');await g.put(g.sourceFile,changed);
  await g.put(g.reportPath,`| \`${g.slug}\` | \`${sha(g.before)}\` | \`${sha(changed)}\` |\n`);
  await assert.rejects(g.plan(),/Visual or protected/);
 }finally{await g.cleanup()}
});

test('stale or forged old HTML/signature is rejected before any metadata write',async()=>{
 const f=await fixture();
 try{
  const manifest={version:1,entries:[{...f.entry,renderSignature:'f'.repeat(64)}]};
  await f.put('media/article-videos/manifest.json',JSON.stringify(manifest));await assert.rejects(f.plan(),/Old render signature/);
  await f.put('media/article-videos/manifest.json',JSON.stringify({version:1,entries:[f.entry]}));
  await f.put('media/article-videos/'+f.prepared.html,f.html+'<!-- unreviewed HTML -->');await assert.rejects(f.plan(),/Old HTML hash/);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(f.root,'scripts/article-videos/storyboards.json'),'utf8')),[f.summary]);
 }finally{await f.cleanup()}
});

test('coherently rehashed HTML with a visual mutation still fails reconstruction against canonical input',async()=>{
 const f=await fixture();
 try{
  const changed=structuredClone(f.card);changed.scenes[0].variant=1;
  const html=await animationHtml(changed,f.root),prepared={...f.prepared,scenes:changed.scenes,htmlSha256:sha(html)};
  // The helper must reject a stale canonical timing even if HTML/manifest checksums agree.
  changed.scenes[0].duration+=1;
  const tamperedHtml=await animationHtml(changed,f.root);prepared.scenes=changed.scenes;prepared.htmlSha256=sha(tamperedHtml);
  const entry={...f.entry,htmlSha256:sha(tamperedHtml),renderSignature:sha(f.version+tamperedHtml)};
  await f.put('media/article-videos/'+f.prepared.html,tamperedHtml);await f.put('media/article-videos/storyboards.json',JSON.stringify([prepared]));await f.put('media/article-videos/manifest.json',JSON.stringify({version:1,entries:[entry]}));
  await assert.rejects(f.plan(),/Visual or protected/);
 }finally{await f.cleanup()}
});

test('a source or report change after a read-only plan prevents all writes',async()=>{
 for(const target of ['source','report']){
  const f=await fixture();
  try{
   const plan=await f.plan(),file=target==='source'?f.sourceFile:f.reportPath;
   await fs.appendFile(path.join(f.root,file),'\nChanged after planning.');
   await assert.rejects(applyMetadataReconciliation(plan),/Input changed since planning/);
   assert.equal(await fs.readFile(path.join(f.root,'media/article-videos/'+f.prepared.html),'utf8'),f.html);
   assert.deepEqual(JSON.parse(await fs.readFile(path.join(f.root,'media/article-videos/manifest.json'),'utf8')).entries,[f.entry]);
  }finally{await f.cleanup()}
 }
});
