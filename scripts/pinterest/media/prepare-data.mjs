import fs from 'node:fs';
import { unified } from 'unified';import remarkParse from 'remark-parse';import remarkGfm from 'remark-gfm';import remarkMath from 'remark-math';import {toString}from'mdast-util-to-string';
import{validateFormats}from'../formats.mjs';
import {readPosts}from'../content.mjs';import{materializeVariant}from'../campaign.mjs';import{imageName,pinTitle,plain}from'../feed.mjs';
function nodeText(n){
 if(n.type==='math')return '$$'+n.value+'$$';
 if(n.type==='inlineMath')return '$'+n.value+'$';
 if(n.type==='table')return n.children.map(r=>r.children.map(nodeText).join(' | ')).join(' • ');
 if(n.type==='list')return n.children.map(nodeText).join(' • ');
 if(typeof n.value==='string')return n.value;
 return (n.children||[]).map(nodeText).join('');
}
const read=name=>JSON.parse(fs.readFileSync(`scripts/pinterest/${name}.json`));
const posts=readPosts('src/content/blog'),bySlug=new Map(posts.map(p=>[p.slug,p])),archive=read('archive'),variants=read('variants'),config=read('config');
const items=archive.map(e=>({...bySlug.get(e.slug),...e,articleTitle:bySlug.get(e.slug).title,kind:'archive'})).concat(variants.map(v=>materializeVariant(v,bySlug.get(v.slug))));
fs.mkdirSync('work/pinterest-media',{recursive:true});
const savedFormats=fs.existsSync('scripts/pinterest/formats.json')?read('formats'):null;
if(savedFormats)validateFormats(savedFormats,archive,variants);
const quota={image:244,video:243,pdf:243},counts={image:0,video:0,pdf:0},formats={},media=[],occurrences=new Map();
for(const [i,pin]of items.entries()){
 const occurrence=occurrences.get(pin.slug)||0, articleIndex=archive.findIndex(a=>a.slug===pin.slug);
 occurrences.set(pin.slug,occurrence+1);
 let format=savedFormats?.[imageName(pin)] || (i<3?'image':['image','video','pdf'][(articleIndex+Math.floor(articleIndex/3)+occurrence)%3]);
 if(!savedFormats && counts[format]===quota[format])format=Object.keys(quota).find(f=>counts[f]<quota[f]);
 counts[format]++;const id=imageName(pin);formats[id]=format;
 const file=`src/content/blog/${pin.category}/${pin.slug}.md`,raw=fs.readFileSync(file,'utf8').replace(/^---[\s\S]*?\n---\s*\n/,'');
 const nodes=unified().use(remarkParse).use(remarkMath).use(remarkGfm).parse(raw).children;
 const source=pin.pinSource;let section=[];
 if(source?.kind==='faq') section=[{type:'paragraph',text:pin.seoDescription}];
 else if(source?.kind==='section'){
  const start=nodes.findIndex(n=>n.type==='heading'&&toString(n)===source.heading),depth=nodes[start]?.depth;
  for(let j=start+1;j<nodes.length;j++){
   const n=nodes[j];if(n.type==='heading'&&n.depth<=depth)break;
   if(['paragraph','list','heading','blockquote','code','table','math'].includes(n.type))section.push({type:['heading','code','table'].includes(n.type)?n.type:'paragraph',text:n.type==='code'?n.value:nodeText(n).replace(/\s+/g,' ').trim()});
  }
 }else{
  let sections=0;
  for(const n of nodes){if(n.type==='heading'){sections++;if(sections>3)break;}
   if(['heading','paragraph','list','code','table','math'].includes(n.type))section.push({type:['heading','code','table'].includes(n.type)?n.type:'paragraph',text:n.type==='code'?n.value:nodeText(n).replace(/\s+/g,' ').trim()});
  }
 }
 section=section.filter(p=>p.text);
 if(format==='pdf' && section.map(p=>p.text).join(' ').split(/\s+/).length<300){
  const used=new Set([...section.map(p=>p.text),source?.heading]);let words=section.map(p=>p.text).join(' ').split(/\s+/).length;
  const start=source?.kind==='section'?Math.max(0,nodes.findIndex(n=>n.type==='heading'&&toString(n)===source.heading)):0;
  for(const n of [...nodes.slice(start),...nodes.slice(0,start)]){
   const text=n.type==='code'?n.value:nodeText(n).replace(/\s+/g,' ').trim();
   if(n.type==='heading'&&/^(sources|références|bibliographie|pour aller plus loin)/i.test(text))break;
   if(!['heading','paragraph','list','blockquote','code','table','math'].includes(n.type)||used.has(text)||!text)continue;
   section.push({type:['heading','code','table'].includes(n.type)?n.type:'paragraph',text});used.add(text);words+=text.split(/\s+/).length;
   if(words>=350)break;
  }
 }
 if(!section.length)throw Error('Missing section '+id);
 const description=plain(pin.seoDescription||pin.excerpt),sentences=new Intl.Segmenter('fr',{granularity:'sentence'}).segment(description);
 const chunks=[];let current='';
 for(const {segment}of sentences){for(const word of segment.trim().split(/\s+/)){if((current+' '+word).trim().length>180){chunks.push(current);current='';}current+=(current?' ':'')+word;}}
 if(current)chunks.push(current);
 const scenes=[{kind:'cover',label:'UN ANGLE POUR COMPRENDRE',text:pinTitle(pin),duration:5.5},...chunks.map((text,i)=>({kind:'point',label:`LE REPÈRE ${String(i+1).padStart(2,'0')}`,text,duration:Math.max(5.5,text.split(/\s+/).length/2.8)})),{kind:'end',label:'PROLONGER LA RÉFLEXION',text:'Le contexte change tout.\nLis le dossier complet.',duration:4.5}];
 media.push({id,format,slug:pin.slug,category:pin.category,categoryLabel:config.categories[pin.category].label,accent:config.categories[pin.category].accent,title:pinTitle(pin),articleTitle:pin.articleTitle||pin.title,description,releaseAt:pin.releaseAt,source:source||{kind:'article',file},articleUrl:`${config.origin}/fr/blog/${pin.slug}/`,section,scenes});
}
validateFormats(formats,archive,variants);
if(!savedFormats)fs.writeFileSync('scripts/pinterest/formats.json',JSON.stringify(formats,null,2)+'\n');
fs.writeFileSync('work/pinterest-media/data.json',JSON.stringify(media,null,2)+'\n');
console.log(counts);console.log('Videos and PDFs per article',Math.min(...posts.filter(p=>archive.some(a=>a.slug===p.slug)).map(p=>new Set(media.filter(m=>m.slug===p.slug).map(m=>m.format)).size)));
