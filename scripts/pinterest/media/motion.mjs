import fs from 'node:fs';
import {brandAnimation} from './branding.mjs';
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const template=fs.readFileSync(new URL('./studio-template.html',import.meta.url),'utf8');
export function motionHtml(card){
 const split="const ss=[...new Intl.Segmenter('fr',{granularity:'sentence'}).segment(s.text)].map(x=>x.segment.trim()).filter(Boolean);";
 const needsQuoteJoin=card.scenes.some(s=>s.kind==='focus'&&[...new Intl.Segmenter('fr',{granularity:'sentence'}).segment(s.text)].some(p=>p.segment.trim().startsWith('»')));
 // Preserve a quoted question and its attribution in a single reading card.
 const source=needsQuoteJoin?template.replace(split,"const ss=[];for(const part of new Intl.Segmenter('fr',{granularity:'sentence'}).segment(s.text)){const text=part.segment.trim();if(text.startsWith('»')&&ss.length)ss[ss.length-1]+=' '+text;else if(text)ss.push(text);}"):template;
 return brandAnimation(source).replaceAll('__TITLE__',escape(card.title)).replaceAll('__ACCENT__',card.accent).replaceAll('__ID__',card.id).replace('__TRANSCRIPT__',card.scenes.map(s=>`<p>${escape(s.text)}</p>`).join('')).replace('__CARD__',JSON.stringify(card).replaceAll('<','\\u003c'));
}
export function animationHtml(card){
 if(!card.approvedPrototype)return motionHtml(card);
 return brandAnimation(fs.readFileSync(new URL('./prototype/animation.html',import.meta.url),'utf8')).replaceAll("url('assets/","url('../assets/").replace("hero.src='assets/hero.webp'",`hero.src='../assets/illustrations/${card.slug}.webp'`).replace('src="soundtrack.m4a"',`src="../video/${card.id}.mp4"`);
}
if(process.argv[1]?.endsWith('/motion.mjs')){
 const data=JSON.parse(fs.readFileSync('scripts/pinterest/video-storyboards.json'));
 fs.mkdirSync('public/pinterest-media/assets/illustrations',{recursive:true});
 for(const card of data){
  if(card.hero)fs.copyFileSync('public'+card.hero,`public/pinterest-media/assets/illustrations/${card.slug}.webp`);
  fs.writeFileSync(`public/pinterest-media/html/${card.id}.html`,animationHtml(card));
 }
 console.log(`${data.length} HTML/CSS/JS animations with synchronized sound playback.`);
}
