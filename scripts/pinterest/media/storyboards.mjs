import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import {toString} from 'mdast-util-to-string';
import {readPosts} from '../content.mjs';

const normalize=t=>t.replace(/\s+/g,' ').trim();
const words=t=>normalize(t).split(/\s+/).length;
const tokens=t=>new Set(t.toLocaleLowerCase('fr').normalize('NFD').replace(/\p{Diacritic}/gu,'').match(/[a-z]{5,}/g)||[]);
const sentences=t=>{
 const result=[];
 for(const part of new Intl.Segmenter('fr',{granularity:'sentence'}).segment(t)){
  let text=normalize(part.segment);
  if(result.length&&text.startsWith('»')){result[result.length-1]+=' »';text=text.slice(1).trim();}
  if(text)result.push(text);
 }
 return result;
};
const cleanQuotes=t=>(t.match(/«/g)||[]).length===(t.match(/»/g)||[]).length?t:normalize(t.replace(/[«»]/g,''));
const posts=new Map(readPosts('src/content/blog').map(p=>[p.slug,p]));
const data=JSON.parse(fs.readFileSync('work/pinterest-media/data.json')).filter(c=>c.format==='video');
const editorial=JSON.parse(fs.readFileSync('scripts/pinterest/media/video-editorial.json'));
const legacy=new Set(['echecs-alzheimer-prevention-declin-cognitif','pourquoi-echecs-probleme-mathematique-impossible-et-ia','echecs-en-prison']);
const out=[];
for(const [index,card] of data.entries()){
 const post=posts.get(card.slug),raw=fs.readFileSync(card.source.file,'utf8'),body=raw.replace(/^---[\s\S]*?\n---\s*\n/,'');
 const nodes=unified().use(remarkParse).use(remarkMath).use(remarkGfm).parse(body).children;
 const paragraphs=[];let heading=card.articleTitle;
 for(const node of nodes){
  if(node.type==='heading'){heading=toString(node);if(/^(sources|références|bibliographie)$/i.test(heading))break;}
  if(node.type==='paragraph'&&!JSON.stringify(node).includes('inlineMath')){
   const text=normalize(toString(node));
   if(text&&words(text)>=7&&!/^(voir aussi|article à venir|pour aller plus loin)/i.test(text))paragraphs.push({text,heading});
  }
 }
 const sourceTexts=card.section.filter(s=>s.type==='paragraph'&&!/[\\$]| • /.test(s.text)).map(s=>normalize(s.text));
 let selected=sourceTexts.map(text=>paragraphs.find(p=>p.text===text)||{text,heading:card.source.heading||card.articleTitle});
 if(card.source.kind==='faq'){
  const key=tokens(card.source.heading+' '+card.description);
  const ranked=paragraphs.map((p,i)=>({...p,i,score:[...tokens(p.heading+' '+p.text)].filter(w=>key.has(w)).length/Math.sqrt(words(p.text))})).sort((a,b)=>b.score-a.score);
  const start=ranked[0]?.i||0;
  selected=[{text:card.description,heading:card.source.heading},...paragraphs.slice(start,start+3)];
 }
 if(selected.reduce((n,p)=>n+words(p.text),0)<65){
  const key=tokens((card.source.heading||card.title)+' '+selected.map(p=>p.text).join(' '));
  const extras=paragraphs.filter(p=>!selected.some(s=>s.text===p.text)).map(p=>({...p,score:[...tokens(p.heading+' '+p.text)].filter(w=>key.has(w)).length/Math.sqrt(words(p.text))})).sort((a,b)=>b.score-a.score);
  for(const p of extras){selected.push(p);if(selected.reduce((n,p)=>n+words(p.text),0)>=95)break;}
 }
 // Keep complete sentences, in source order, including nearby qualifications.
 const units=[];const seen=new Set();
 for(const p of selected){for(const text of sentences(p.text)){
  if(seen.has(text)||text.length<3||/^(Rapport intégral|Annonce de lancement)\.?$/i.test(text)||/article[s]? à venir/i.test(text)||/^\d+[.)]$/.test(text))continue;
  seen.add(text);units.push({text,heading:p.heading});
 }}
 let picked=[],count=0;
 for(const paragraph of selected){
  const ss=sentences(paragraph.text).filter(text=>text.length>=3&&!/^(Rapport intégral|Annonce de lancement)\.?$/i.test(text)&&!/article[s]? à venir/i.test(text));
  const fresh=ss.filter(text=>!picked.some(u=>u.text===text));const n=words(fresh.join(' '));
  if(!fresh.length)continue;
  if(count>=85)break;
  if(count>=65&&count+n>165)break;
  if(n>170){for(const text of fresh){if(count>=115)break;picked.push({text,heading:paragraph.heading});count+=words(text);}}
  else{picked.push(...fresh.map(text=>({text,heading:paragraph.heading})));count+=n;}
 }
 // Complete source paragraphs keep the limitation beside the result it qualifies.
 const caveat=units.find(u=>/ne (?:prouve|démontre|signifie|garantit|permet)|ne .* pas |pas (?:une|un) (?:preuve|traitement)|incertain|limite|pas automatiquement/i.test(u.text));
 if(caveat&&!picked.some(u=>u.text===caveat.text)&&card.category==='science'&&words(caveat.text)<=40&&count+words(caveat.text)<=165){picked.push(caveat);}
 // Four reading sequences, balanced without cutting any sentence in half.
 const groups=[];
 const target=picked.reduce((n,p)=>n+words(p.text),0)/4;
 const memo=new Map();
 function partition(start,left){
  if(left===0)return start===picked.length?{cost:0,parts:[]}:null;
  const key=start+':'+left;if(memo.has(key))return memo.get(key);
  let best=null;
  for(let end=start+1;end<=picked.length-left+1;end++){
   const text=picked.slice(start,end).map(u=>u.text).join(' '),tail=partition(end,left-1);if(!tail)continue;
   const n=words(text),cost=tail.cost+(n-target)**2+Math.max(0,n-42)**2*3;
   if(!best||cost<best.cost)best={cost,parts:[{text,heading:picked[start].heading},...tail.parts]};
  }
  memo.set(key,best);return best;
 }
 const balanced=partition(0,Math.min(4,picked.length));if(balanced)groups.push(...balanced.parts);
 if(groups.length<3||groups.some(g=>words(g.text)>75))throw Error(`Review storyboard grouping: ${card.id}`);
 const edit=editorial[card.id];
 if(edit){groups.splice(0,groups.length,...edit.points.map((text,i)=>({text,heading:edit.labels?.[i]||card.source.heading||card.articleTitle})));}
 for(const group of groups)group.text=cleanQuotes(group.text);
 const title=edit?.title||card.title.replace(/^Échecs\s*:\s*/,'');
 const scenes=[{kind:'cover',label:card.categoryLabel.toUpperCase(),text:title,duration:6}];
 for(const [i,g]of groups.entries())scenes.push({kind:['reading','focus','reading','focus'][i%4],label:['LE POINT DE DÉPART','POUR COMPRENDRE','UN REPÈRE UTILE','GARDER LE CONTEXTE'][i],text:g.text,heading:g.heading,duration:Math.max(7.5,words(g.text)/2.8+1.1),sourceText:g.text});
 scenes.push({kind:'end',label:'POUR ALLER PLUS LOIN',text:edit?.closing||'Une idée à comprendre.\nUn dossier pour approfondir.',duration:6});
 let duration=scenes.reduce((n,s)=>n+s.duration,0);if(duration<45){const extra=(45-duration)/groups.length;scenes.filter(s=>s.sourceText).forEach(s=>s.duration+=extra);}
 duration=Math.ceil(scenes.reduce((n,s)=>n+s.duration,0)*24)/24;scenes.at(-1).duration+=duration-scenes.reduce((n,s)=>n+s.duration,0);
 if(card.id==='biais-de-confirmation-aux-echecs'){
  const prototype=[
   ['cover','LE BIAIS DE CONFIRMATION','Ton plan est brillant. Et sa meilleure réponse ? Une idée à mettre à l’épreuve.',6],
   ['reading','LE PIÈGE','Tu calcules ce qui t’arrange ? Une belle variante ne suffit pas. Ton plan : la réponse que tu espères, la défense que tu oublies. L’adversaire choisit aussi son coup.',6],
   ['focus','UN EXEMPLE CONSTRUIT','Tu vises le mat en f7. 1.e4 e5 2.Fc4 Cc6 3.Dh5. La menace : Dxf7 mat.',28/3],
   ['reading','LA RÉPONSE OUBLIÉE','Mais il peut jouer… g6. Les Noirs choisissent une autre défense. Ta dame est attaquée. Sa diagonale vers f7 est coupée.',8],
   ['focus','À ESSAYER DANS TES ANALYSES','Avant de jouer, change de camp. Quelle réponse ferait échouer ton idée ? Échecs, captures, menaces. Adapte ta recherche à la position et au temps qu’il te reste.',26/3],
   ['end','LE RÉFLEXE À GARDER','Teste ton plan. Pas seulement ton espoir. Comprendre le biais de confirmation : le dossier complet sur le blog.',22/3]
  ];
  scenes.splice(0,scenes.length,...prototype.map(([kind,label,text,duration])=>({kind,label,text,duration})));
  duration=136/3;
 }
 const idHash=createHash('sha256').update(card.id).digest('hex');
 out.push({...card,title,scenes,duration,hero:legacy.has(card.slug)||post.heroImage?.sourceUrl?null:post.heroImage?.src,heroAlt:post.heroImage?.alt||'',audioSeed:parseInt(idHash.slice(0,7),16),musicVersion:'original-neo-2026-v2',storyboardVersion:2,editorial:!!edit,approvedPrototype:card.id==='biais-de-confirmation-aux-echecs',sourceHash:createHash('sha256').update(raw).digest('hex'),textWords:scenes.reduce((n,s)=>n+words(s.text),0)});
}
if(!process.argv.includes('--check-only')){
fs.writeFileSync('scripts/pinterest/video-storyboards.json',JSON.stringify(out,null,2)+'\n');
fs.writeFileSync('work/pinterest-media/storyboard-review.txt',out.map((c,i)=>`${i+1}. ${c.id} (${c.duration.toFixed(1)}s, ${c.textWords} mots)\n${c.scenes.map(s=>s.text).join('\n\n')}\n`).join('\n---\n'));
}
console.log({videos:out.length,minDuration:Math.min(...out.map(c=>c.duration)),maxDuration:Math.max(...out.map(c=>c.duration)),minWords:Math.min(...out.map(c=>c.textWords)),maxWords:Math.max(...out.map(c=>c.textWords))});
