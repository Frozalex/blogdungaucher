import fs from 'node:fs';
import {readPosts} from './content.mjs';
const config=JSON.parse(fs.readFileSync('scripts/pinterest/config.json'));
const images=JSON.parse(fs.readFileSync('scripts/pinterest/pixel-art-images.json'));
const boards={science:'255086835083462187',esprit:'255086835083462189',societe:'255086835083462188'};
const posts=readPosts('src/content/blog').filter(p=>images[p.slug]&&boards[p.category]&&!p.draft&&!p.noindex&&p.slug!=='echecs-et-immigration');
const remaining=new Map(posts.map(p=>[p.slug,p])), entries=[];
const day=new Date('2026-11-23T14:00:00Z');
while(remaining.size){
 if([1,4].includes(day.getUTCDay())){
  const available=[...remaining.values()].filter(p=>new Date(p.publishedAt)<=day).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)||a.slug.localeCompare(b.slug));
  const previous=entries.at(-1)?.category;
  const p=available.find(p=>p.category!==previous)||available[0];
  if(p){
   const link=new URL(`/fr/blog/${p.slug}/`,config.origin);
   link.search=new URLSearchParams({utm_source:'pinterest',utm_medium:'organic_social',utm_campaign:'pixel_art',utm_content:p.slug}).toString();
   const title=(p.seoTitle||p.title).replace(/\s+/g,' ').trim();
   const description=(p.seoDescription||p.excerpt||p.description||p.title).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
   if(title.length>100||description.length>500)throw new Error(`Text too long: ${p.slug}`);
   const date=day.toISOString();
   entries.push({slug:p.slug,category:p.category,publishedAt:p.publishedAt,date,board:config.categories[p.category].board,info:{publicationDate:{dateTime:date.slice(0,10)+'T10:00:00',timezone:'America/Guadeloupe'},providers:[{network:'pinterest'}],text:description,media:[config.origin+images[p.slug]],autoPublish:true,saveExternalMediaFiles:true,draft:false,shortener:false,pinterestData:{boardId:boards[p.category],pinTitle:title,pinLink:link.href,pinNewFormat:false,isAiGenerated:true}}});
   remaining.delete(p.slug);
  }
 }
 day.setUTCDate(day.getUTCDate()+1);
 if(day.getUTCFullYear()>2030)throw new Error('Queue did not terminate');
}
fs.mkdirSync('docs/pinterest/metricool',{recursive:true});
fs.writeFileSync('docs/pinterest/metricool/queue.json',JSON.stringify({brandId:'8276044',timezone:'America/Guadeloupe',excludedPublishedPin:'https://www.pinterest.com/pin/255086766390959263/',entries},null,2)+'\n');
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const rows=[['Title','Media URL','Pinterest board','Thumbnail','Description','Link','Publish date','Keywords'],...entries.map(e=>[e.info.pinterestData.pinTitle,e.info.media[0],e.board,'',e.info.text,e.info.pinterestData.pinLink,e.date.slice(0,19),'échecs,pixel art,'+config.categories[e.category].label])];
fs.writeFileSync('docs/pinterest/metricool/pinterest-pixel-art.csv','\ufeff'+rows.map(r=>r.map(csv).join(',')).join('\r\n')+'\r\n');
console.log(JSON.stringify({count:entries.length,first:entries[0],last:entries.at(-1).date}));
