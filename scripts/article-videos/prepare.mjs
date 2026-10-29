import fs from 'node:fs/promises';
import path from 'node:path';
import {options,makeCard,animationHtml,atomic,sha,escaped} from './common.mjs';
const args=options(),root=process.cwd(),out=path.resolve(args.out||'media/article-videos');
await fs.mkdir(path.join(out,'assets'),{recursive:true});
for(const name of ['studio-regular.ttf','studio-bold.ttf','FONT-LICENSE.txt']){const source=path.resolve('public/article-videos/assets',name),destination=path.join(out,'assets',name);if(source!==destination)await fs.copyFile(source,destination)}
if((args['include-future']||(args.at&&Date.parse(args.at)>Date.now()))&&(out===path.resolve('public')||out.startsWith(path.resolve('public')+path.sep)))throw Error('Future video preparation/rendering is forbidden in public storage');
const inputs=String(args.input||'scripts/article-videos/storyboards.json').split(',');
let summaries=[];for(const input of inputs)summaries.push(...JSON.parse(await fs.readFile(input,'utf8')));
if(args.id)summaries=summaries.filter(s=>s.slug===args.id);
const seen=new Set(),signatures=new Set(),manifest=[],plan=[];
for(const summary of summaries){
 if(seen.has(summary.slug))throw Error('Duplicate summary: '+summary.slug);seen.add(summary.slug);
 const card=await makeCard(summary,root);
 const eligible=!card.draft&&Date.parse(card.publishDate)<=Date.parse(args.at||new Date().toISOString());
 plan.push({slug:card.slug,title:card.title,category:card.category,publishDate:card.publishDate,eligible,sourceFile:card.sourceFile,sourceSha256:card.sourceSha256,summarySha256:card.summarySha256});
 if(!eligible&&!args['include-future'])continue;
 let attempts=0;
 for(;;){
  card.scenes=card.scenes.map((s,i)=>({...s,variant:parseInt(sha(`${card.slug}:${i}:${attempts}`).slice(0,8),16)%2}));
  const signature=card.scenes.map(s=>`${s.layout}:${s.variant}`).join('|');
  if(!signatures.has(signature)){signatures.add(signature);card.compositionSignature=signature;break;}
  attempts++;if(attempts>16)throw Error('Composition collision: '+card.slug);
 }
 const html=await animationHtml(card,root);await atomic(path.join(out,'html',card.slug+'.html'),html);
 const {hero,...metadata}=card;
 manifest.push({...metadata,hero:hero?{src:hero.src,sha256:hero.sha256,alt:hero.alt,sourceUrl:hero.sourceUrl,credit:hero.credit,license:hero.license}:null,html:`html/${card.slug}.html`,htmlSha256:sha(html),video:`video/${card.slug}.mp4`,poster:`posters/${card.slug}.jpg`,status:'animation-prepared',audio:'original-music-and-effects-no-voice'});
}
await atomic(path.resolve(args.plan||'work/article-videos/plan.json'),JSON.stringify({plannedAt:new Date().toISOString(),articles:plan},null,2)+'\n');
try{await fs.access(path.join(out,'manifest.json'))}catch{await atomic(path.join(out,'manifest.json'),JSON.stringify({version:1,entries:[]},null,2)+'\n')}
await atomic(path.join(out,'storyboards.json'),JSON.stringify(manifest,null,2)+'\n');
await atomic(path.join(out,'index.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Résumés vidéo des articles</title><style>body{font:18px system-ui;background:#f6f5f1;color:#171c1c;max-width:1200px;margin:40px auto;padding:24px}h1{font-size:42px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px}article{border:1px solid #ccc;padding:24px;border-radius:12px}a{color:#254e6a}iframe{width:100%;aspect-ratio:16/9;border:0}small{color:#626b66}</style><h1>Résumés vidéo des articles</h1><p>${manifest.length} compositions horizontales. Animations prêtes, exports MP4 à vérifier séparément.</p><main>${manifest.map(c=>`<article><small>${escaped(c.categoryLabel)} · ${Math.round(c.duration)} s</small><h2>${escaped(c.title)}</h2><p>${escaped(c.visualIntent||'')}</p><a href="${c.html}">Voir l’animation</a> · <a href="${c.articleUrl}">Lire le dossier</a></article>`).join('')}</main></html>`);
console.log(JSON.stringify({prepared:manifest.length,distinctCompositions:signatures.size,out},null,2));
