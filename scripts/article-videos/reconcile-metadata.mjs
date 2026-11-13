/** Explicit editorial review only; this tool never renders or rewrites a video. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
import {parseFrontmatter} from '@astrojs/markdown-remark';
import {makeCard,animationHtml,preparedCardFromHtml,preparationHash,pipelineHash,sha,escaped,atomic,scriptDirectory} from './common.mjs';
import {acquireRenderLock} from './lock.mjs';

// Audited contract: these metadata fields are not read by the canvas renderer.
// A future studio revision requires a new code review, not a CLI override.
const REVIEWED_STUDIO_SHA256='c9fda8c5e172f01495a8fe64edaeb1635d5cb7514bff15ca0c22ab85b4072be0';
const mutableCardKeys=new Set(['sourceSha256','title','summarySha256']);
const hashPattern=/^[a-f0-9]{64}$/;
const stable=value=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])])):value;
const equal=(actual,expected,message)=>{if(!isDeepStrictEqual(actual,expected))throw Error(message)};
const requiredHash=(value,label)=>{if(!hashPattern.test(value||''))throw Error('Invalid '+label)};
const withoutMetadata=card=>Object.fromEntries(Object.entries(card).filter(([key])=>!mutableCardKeys.has(key)));
export const visualInputsHash=card=>sha(JSON.stringify(stable(withoutMetadata(card))));

/** Reject every change except the three explicitly reviewed metadata fields. */
export function assertMetadataOnly(before,after){
 equal(withoutMetadata(after),withoutMetadata(before),'Visual or protected card input changed; re-render required');
 equal(visualInputsHash(after),visualInputsHash(before),'Visual input fingerprint changed');
}

function uniqueMap(items,label){
 if(!Array.isArray(items))throw Error('Invalid '+label);
 const result=new Map();
 for(const item of items){if(!/^[a-z0-9-]+$/.test(item.slug||'')||result.has(item.slug))throw Error('Invalid or duplicate '+label);result.set(item.slug,item)}
 return result;
}

function reviewedSources(report){
 const result=new Map();
 // The report binds semantic review to exact old and new source bytes.
 for(const match of report.matchAll(/^\|\s*`([a-z0-9-]+)`\s*\|\s*`([a-f0-9]{64})`\s*\|\s*`([a-f0-9]{64})`\s*\|\s*$/gm)){
  if(result.has(match[1]))throw Error('Duplicate source review: '+match[1]);
  result.set(match[1],{before:match[2],after:match[3]});
 }
 return result;
}

const mediaHero=hero=>hero?Object.fromEntries(Object.entries(hero).filter(([key])=>key!=='uri')):null;
function expectedPrepared(card,html){
 const {hero,...metadata}=card;
 return {...metadata,hero:mediaHero(hero),html:`html/${card.slug}.html`,htmlSha256:sha(html),video:`video/${card.slug}.mp4`,poster:`posters/${card.slug}.jpg`,status:'animation-prepared',audio:'original-music-and-effects-no-voice'};
}

/** Read and validate all inputs before proposing any writes. Does not read MP4/JPG bytes. */
export async function planMetadataReconciliation(root=process.cwd(),{reviewedSlugs,reviewReport,now=new Date()}={}){
 root=path.resolve(root);
 if(!Array.isArray(reviewedSlugs)||!reviewedSlugs.length||new Set(reviewedSlugs).size!==reviewedSlugs.length||reviewedSlugs.some(slug=>!/^[a-z0-9-]+$/.test(slug)))throw Error('Explicit unique reviewed-slugs are required');
 if(typeof reviewReport!=='string'||!reviewReport.trim())throw Error('A review report is required');
 const reportFile=path.resolve(root,reviewReport),reportPath=path.relative(root,reportFile);
 if(reportPath.startsWith('..'+path.sep)||path.isAbsolute(reportPath)||!reportPath)throw Error('Keep the review report inside the repository for traceability');
 const observed=new Map(),binaries=[];
 const read=async file=>{file=path.resolve(file);const bytes=await fs.readFile(file);const digest=sha(bytes);if(observed.has(file)&&observed.get(file).sha256!==digest)throw Error('Input changed during review planning: '+file);observed.set(file,{file,sha256:digest});return bytes};
 const reportBytes=await read(reportFile),report=reportBytes.toString('utf8');
 if(!report.trim())throw Error('The review report is empty');
 const reviewed=reviewedSources(report);
 const studio=await read(path.join(scriptDirectory,'studio.html'));
 if(sha(studio)!==REVIEWED_STUDIO_SHA256)throw Error('Studio metadata-only contract changed; review this helper before use');
 const version=await pipelineHash(),generator=await preparationHash();
 for(const name of ['common.mjs','prepare.mjs','studio.html','render.mjs','lock.mjs','compose.py'])await read(path.join(scriptDirectory,name));
 const out=path.join(root,'media/article-videos'),canonicalFile=path.join(root,'scripts/article-videos/storyboards.json'),preparedFile=path.join(out,'storyboards.json'),manifestFile=path.join(out,'manifest.json'),galleryFile=path.join(out,'index.html');
 const canonical=JSON.parse((await read(canonicalFile)).toString('utf8')),prepared=JSON.parse((await read(preparedFile)).toString('utf8')),manifest=JSON.parse((await read(manifestFile)).toString('utf8'));
 if(manifest.version!==1)throw Error('Unsupported video manifest');
 const summaries=uniqueMap(canonical,'canonical summary'),cards=uniqueMap(prepared,'prepared card'),entries=uniqueMap(manifest.entries,'rendered entry');
 let gallery=(await read(galleryFile)).toString('utf8');
 const writes=[],reviews=[];
 for(const slug of reviewedSlugs){
  const input=summaries.get(slug),preparedCard=cards.get(slug),entry=entries.get(slug),review=reviewed.get(slug);
  if(!input||!preparedCard||!entry)throw Error('Missing complete rendered article: '+slug);
  if(!review)throw Error('The report does not bind old/new source hashes for '+slug);
  if(input.sourceFile!==`src/content/blog/${input.category}/${slug}.md`)throw Error('Unexpected source path: '+slug);
  const sourceBytes=await read(path.join(root,input.sourceFile)),sourceHash=sha(sourceBytes),metadata=parseFrontmatter(sourceBytes.toString('utf8')).frontmatter;
  equal(review,{before:input.sourceSha256,after:sourceHash},'Source does not match the explicit editorial review: '+slug);
  if(typeof metadata.title!=='string'||!metadata.title.trim())throw Error('Missing article title: '+slug);
  if(input.sourceSha256===sourceHash&&input.title===metadata.title)throw Error('No metadata reconciliation needed: '+slug);
  const oldSummaryHash=sha(JSON.stringify(input));
  for(const object of [preparedCard,entry]){
   equal(object.sourceSha256,input.sourceSha256,'Old source hash differs: '+slug);
   equal(object.summarySha256,oldSummaryHash,'Old summary is not the reviewed rendered summary: '+slug);
   equal(object.title,input.title,'Old title differs: '+slug);
   equal(object.preparationHash,generator,'Preparation pipeline changed; re-render required: '+slug);
  }
  equal(preparedCard.html,`html/${slug}.html`,'Unexpected prepared HTML path');
  const htmlFile=path.join(out,'html',slug+'.html'),oldHtml=(await read(htmlFile)).toString('utf8'),oldCard=preparedCardFromHtml(oldHtml);
  equal(oldCard.sourceSha256,input.sourceSha256,'Embedded source hash differs: '+slug);
  equal(oldCard.summarySha256,oldSummaryHash,'Embedded summary hash differs: '+slug);
  equal(oldCard.title,input.title,'Embedded title differs: '+slug);
  equal(oldCard.preparationHash,generator,'Embedded preparation pipeline changed: '+slug);
  equal(entry.html,`/article-videos/html/${slug}.html`,'Unexpected manifest HTML path');
  equal(entry.htmlSha256,sha(oldHtml),'Old HTML hash differs: '+slug);
  equal(entry.renderSignature,sha(version+oldHtml),'Old render signature does not match the current pipeline: '+slug);
  equal(preparedCard,expectedPrepared(oldCard,oldHtml),'Prepared metadata differs from embedded card: '+slug);
  // Exact template reconstruction also protects code, colors, transcript and accessible HTML.
  equal(await animationHtml(oldCard,root),oldHtml,'Old HTML differs from the unchanged animation template: '+slug);
  for(const key of ['regular','bold']){
   for(const directory of [path.join(root,'public/article-videos/assets'),path.join(out,'assets')]){
    equal(sha(await read(path.join(directory,`studio-${key}.ttf`))),oldCard.fonts[key],'Animation font changed: '+slug);
   }
  }
  equal(sha(await read(path.join(root,'public/images/logo-transparent.svg'))),oldCard.logoSha256,'Logo changed: '+slug);
  if(oldCard.hero)equal(sha(await read(path.join(root,'public',oldCard.hero.src))),oldCard.hero.sha256,'Hero changed: '+slug);
  const nextInput={...input,sourceSha256:sourceHash,title:metadata.title};
  const generated=await makeCard(nextInput,root);
  // Preparation chooses variants across the whole corpus; retain the already rendered choices.
  generated.scenes=generated.scenes.map((scene,i)=>({...scene,variant:oldCard.scenes[i]?.variant}));
  generated.compositionSignature=oldCard.compositionSignature;
  assertMetadataOnly(oldCard,generated);
  const nextCard={...oldCard,sourceSha256:sourceHash,title:metadata.title,summarySha256:sha(JSON.stringify(nextInput))};
  assertMetadataOnly(oldCard,nextCard);
  // Match the rendered entry's protected fields against its complete embedded provenance.
  for(const key of ['slug','category','publishDate','draft','noindex','sourceFile','fonts','logoSha256','width','height','fps'])equal(entry[key],oldCard[key],'Rendered provenance differs: '+key+'/'+slug);
  equal(entry.hero,mediaHero(oldCard.hero),'Rendered hero differs: '+slug);
  equal(entry.scenes,oldCard.scenes.map(({heading,text})=>({heading,text})),'Rendered transcript differs: '+slug);
  equal(entry.layoutSignature,oldCard.compositionSignature,'Rendered composition differs: '+slug);
  for(const [key,hashKey,directory,extension] of [['video','sha256','video','mp4'],['poster','posterSha256','posters','jpg']]){
   equal(entry[key],`/article-videos/${directory}/${slug}.${extension}`,'Unexpected binary path');requiredHash(entry[hashKey],hashKey);
   const file=path.join(out,directory,slug+'.'+extension),stat=await fs.stat(file);
   if(!stat.isFile()||stat.size===0)throw Error('Missing complete binary: '+file);
   binaries.push({file,size:stat.size,mtimeMs:stat.mtimeMs,ino:stat.ino});
  }
  if(!Number.isFinite(Date.parse(entry.renderedAt)))throw Error('Missing original rendering date: '+slug);
  const html=await animationHtml(nextCard,root),htmlHash=sha(html),signature=sha(version+html);
  const proof={
   kind:'editorial-metadata-only',reconciledAt:now.toISOString(),
   report:{path:reportPath.split(path.sep).join('/'),sha256:sha(reportBytes)},
   source:{path:input.sourceFile,before:input.sourceSha256,after:sourceHash},
   summary:{before:oldSummaryHash,after:nextCard.summarySha256},title:{before:input.title,after:nextCard.title},
   visualInputs:{before:visualInputsHash(oldCard),after:visualInputsHash(nextCard)},
   html:{before:sha(oldHtml),after:htmlHash},renderSignature:{before:entry.renderSignature,after:signature},
   pipelineHash:version,preparationHash:generator,studioSha256:REVIEWED_STUDIO_SHA256,
   preservedMedia:{videoSha256:entry.sha256,posterSha256:entry.posterSha256,renderedAt:entry.renderedAt},
   visualValidation:'No new frame or sound review performed by this tool.',
   binaryValidation:'Binary bytes unchanged by this tool; existing verify.mjs remains required.',
  };
  const nextEntry={...entry,sourceSha256:sourceHash,title:nextCard.title,summarySha256:nextCard.summarySha256,htmlSha256:htmlHash,renderSignature:signature,metadataReview:[...(Array.isArray(entry.metadataReview)?entry.metadataReview:entry.metadataReview?[entry.metadataReview]:[]),proof]};
  const nextPrepared={...preparedCard,sourceSha256:sourceHash,title:nextCard.title,summarySha256:nextCard.summarySha256,htmlSha256:htmlHash};
  const articleBlocks=[...gallery.matchAll(/<article>.*?<\/article>/gs)].filter(match=>match[0].includes(`href="html/${slug}.html"`));
  if(articleBlocks.length!==1)throw Error('Gallery entry missing or ambiguous: '+slug);
  const block=articleBlocks[0][0],oldHeading=`<h2>${escaped(input.title)}</h2>`;
  if(block.split(oldHeading).length!==2)throw Error('Gallery title differs: '+slug);
  gallery=gallery.replace(block,block.replace(oldHeading,`<h2>${escaped(nextCard.title)}</h2>`));
  summaries.set(slug,nextInput);cards.set(slug,nextPrepared);entries.set(slug,nextEntry);reviews.push({slug,...proof});
  writes.push({file:htmlFile,content:html});
 }
 writes.push(
  {file:canonicalFile,content:JSON.stringify(canonical.map(item=>summaries.get(item.slug)),null,2)+'\n'},
  {file:preparedFile,content:JSON.stringify(prepared.map(item=>cards.get(item.slug)),null,2)+'\n'},
  {file:galleryFile,content:gallery},
  {file:manifestFile,content:JSON.stringify({...manifest,entries:manifest.entries.map(item=>entries.get(item.slug))},null,2)+'\n'},
 );
 return {root,out,writes,observed:[...observed.values()],binaries,reviews};
}

export async function applyMetadataReconciliation(plan){
 const lock=await acquireRenderLock(path.join(plan.out,'.render.lock'));
 try{
  // Recheck after acquiring the same lock as the encoder, before the first write.
  for(const {file,sha256} of plan.observed)if(sha(await fs.readFile(file))!==sha256)throw Error('Input changed since planning: '+file);
  for(const prior of plan.binaries){const stat=await fs.stat(prior.file);if(stat.size!==prior.size||stat.mtimeMs!==prior.mtimeMs||stat.ino!==prior.ino)throw Error('Binary changed since planning: '+prior.file)}
  const originals=new Map();for(const write of plan.writes)originals.set(write.file,await fs.readFile(write.file));
  const committed=[];
  try{for(const write of plan.writes){lock.assertHeld();await atomic(write.file,write.content);committed.push(write)}}
  catch(error){for(const write of committed.reverse()){if(sha(await fs.readFile(write.file))===sha(write.content))await atomic(write.file,originals.get(write.file))}throw error}
 }finally{await lock.release()}
 return plan.reviews;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{
  const args={};for(const arg of process.argv.slice(2)){const match=arg.match(/^--(reviewed-slugs|review-report)=(.+)$/);if(match){if(args[match[1]])throw Error('Duplicate option');args[match[1]]=match[2]}else if(arg==='--apply'||arg==='--help')args[arg.slice(2)]=true;else throw Error('Unknown option: '+arg)}
  if(args.help){console.log('node scripts/article-videos/reconcile-metadata.mjs --reviewed-slugs=slug,slug --review-report=docs/review.md [--apply]\nDefault: read-only plan. --apply updates reviewed metadata; never renders. Run existing verify.mjs afterwards.');}
  else{
   const plan=await planMetadataReconciliation(process.cwd(),{reviewedSlugs:args['reviewed-slugs']?.split(','),reviewReport:args['review-report']});
   if(args.apply)await applyMetadataReconciliation(plan);
   console.log(JSON.stringify({mode:args.apply?'metadata-updated':'read-only-plan',reviewed:plan.reviews,files:plan.writes.map(write=>path.relative(plan.root,write.file)),next:'Run the existing verify.mjs; no fresh visual/audio validation is claimed.'},null,2));
  }
 }catch(error){console.error(error.message);process.exitCode=1}
}
