import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {parseFrontmatter} from '@astrojs/markdown-remark';

export const scriptDirectory=path.dirname(fileURLToPath(import.meta.url));
export const layouts=['hero-split','thesis','comparison','steps','concept-map','timeline','metric-context','question','takeaway','quote-context','orbit','split-cards'];
export const categories={science:{label:'Science',accent:'#5b9fd4'},esprit:{label:'Esprit',accent:'#f0a050'},societe:{label:'Société',accent:'#5cc4b0'},'grand-oral':{label:'Grand oral',accent:'#a695cb'}};
export const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export const words=text=>String(text).trim().split(/\s+/u).filter(Boolean).length;
export const options=()=>Object.fromEntries(process.argv.slice(2).filter(a=>a.startsWith('--')).map(a=>{const i=a.indexOf('=');return i<0?[a.slice(2),true]:[a.slice(2,i),a.slice(i+1)]}));
export const escaped=text=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const uri=(bytes,type)=>`data:${type};base64,${Buffer.from(bytes).toString('base64')}`;
export async function atomic(file,data){await fs.mkdir(path.dirname(file),{recursive:true});const tmp=file+'.tmp-'+process.pid;await fs.writeFile(tmp,data);await fs.rename(tmp,file);}
async function filesHash(names,directory=scriptDirectory){const h=createHash('sha256');for(const name of names)h.update(name+'\0').update(await fs.readFile(path.join(directory,name))).update('\0');return h.digest('hex');}
export const preparationHash=(directory=scriptDirectory)=>filesHash(['common.mjs','prepare.mjs','studio.html'],directory);
export const pipelineHash=()=>filesHash(['common.mjs','prepare.mjs','studio.html','render.mjs','lock.mjs','compose.py']);
export function preparedCardFromHtml(html){const match=html.match(/^const card=(.+);$/m);if(!match)throw Error('Prepared HTML has no storyboard');return JSON.parse(match[1]);}
export function assertPreparation(card,html,currentHash){
 if(card.preparationHash!==currentHash||preparedCardFromHtml(html).preparationHash!==currentHash)throw Error('Animation generator changed; prepare HTML again: '+card.slug);
}
export async function makeCard(input,root=process.cwd()){
 if(!/^[a-z0-9-]+$/.test(input.slug)||!categories[input.category])throw Error('Invalid article identity');
 const expected=`src/content/blog/${input.category}/${input.slug}.md`;
 if(input.sourceFile!==expected)throw Error('Unexpected article source path: '+input.slug);
 const source=await fs.readFile(path.join(root,expected));
 if(input.sourceSha256!==sha(source))throw Error('The article changed; review its summary: '+input.slug);
 const data=parseFrontmatter(source.toString('utf8')).frontmatter;
 if(data.category!==input.category)throw Error('Article category mismatch: '+input.slug);
 if(!Array.isArray(input.scenes)||input.scenes.length<6||input.scenes.length>8)throw Error('A summary needs 6 to 8 scenes: '+input.slug);
 if(input.scenes[0].role!=='hook'||input.scenes.at(-1).role!=='closing'||!input.scenes.some(s=>s.role==='nuance'))throw Error('Missing introduction, limitation or conclusion: '+input.slug);
 let start=0;
 const scenes=input.scenes.map((s,i)=>{
  if(!['hook','idea','nuance','closing'].includes(s.role)||!layouts.includes(s.layout)||typeof s.heading!=='string'||!s.heading.trim()||typeof s.text!=='string'||!s.text.trim()||typeof s.sourceHeading!=='string'||!s.sourceHeading.trim())throw Error('Incomplete scene: '+input.slug+'/'+i);
  if(/[\p{Extended_Pictographic}\u2654-\u265f\uFE0F\u20E3]/u.test(s.heading+' '+s.text))throw Error('Emoji or chess glyph in summary: '+input.slug);
  const duration=Math.ceil(Math.max(7,Math.min(24,(words(s.text)+words(s.heading))/2.25+2))*24)/24;
  const result={...s,start,duration};start+=duration;return result;
 });
 const wordCount=scenes.reduce((n,s)=>n+words(s.text),0);
 if(wordCount<100||wordCount>280)throw Error(`Summary length ${wordCount} is outside 100–280 words: ${input.slug}`);
 const seed=parseInt(sha(input.slug).slice(0,8),16);
 let hero=null;
 if(data.heroImage?.src){
  const src=data.heroImage.src;
  if(!/^\/images\/[a-zA-Z0-9/_-]+\.(webp|png|jpe?g|svg)$/.test(src))throw Error('Unexpected hero image: '+input.slug);
  if(data.heroImage.sourceUrl&&!/^https?:\/\//.test(data.heroImage.sourceUrl))throw Error('Unexpected image credit URL');
  const bytes=await fs.readFile(path.join(root,'public',src));
  const ext=path.extname(src);const type=ext==='.svg'?'image/svg+xml':ext==='.webp'?'image/webp':ext==='.png'?'image/png':'image/jpeg';
  hero={src,sha256:sha(bytes),uri:uri(bytes,type),alt:data.heroImage.alt||'',sourceUrl:data.heroImage.sourceUrl||null,credit:data.heroImage.credit||null,license:data.heroImage.license||null};
 }
 const fonts={regular:sha(await fs.readFile(path.join(root,'public/article-videos/assets/studio-regular.ttf'))),bold:sha(await fs.readFile(path.join(root,'public/article-videos/assets/studio-bold.ttf')))};
 const logoSha256=sha(await fs.readFile(path.join(root,'public/images/logo-transparent.svg')));
 return {...input,preparationHash:await preparationHash(),fonts,logoSha256,summarySha256:sha(JSON.stringify(input)),title:input.title||data.title,scenes,duration:start,wordCount,compositionSeed:seed,categoryLabel:categories[input.category].label,accent:categories[input.category].accent,hero,publishDate:new Date(data.publishDate).toISOString(),draft:data.draft===true,noindex:data.noindex===true,articleUrl:`https://blogdungaucher.com/fr/blog/${input.slug}/`,audioSeed:seed%10000000,width:1920,height:1080,fps:24};
}
export async function animationHtml(card,root=process.cwd()){
 const template=await fs.readFile(path.join(scriptDirectory,'studio.html'),'utf8');
 const logo=await fs.readFile(path.join(root,'public/images/logo-transparent.svg'));
 const credits=card.hero?.sourceUrl?`<p>Illustration : ${escaped(card.hero.credit||'Auteur indiqué sur la source')} · ${escaped(card.hero.license||'Licence indiquée sur la source')}. <a href="${escaped(card.hero.sourceUrl)}">Source de l’illustration</a>. Image conservée entière, filigrane du site préexistant.</p>`:'';
 return template.replace('__CREDITS__',credits).replaceAll('__TITLE__',escaped(card.title)).replace('__CARD__',JSON.stringify(card).replaceAll('<','\\u003c')).replace('__LOGO__',uri(logo,'image/svg+xml')).replace('__REGULAR__','../assets/studio-regular.ttf').replace('__BOLD__','../assets/studio-bold.ttf').replace('__TRANSCRIPT__',card.scenes.map(s=>`<h2>${escaped(s.heading)}</h2><p>${escaped(s.text)}</p>`).join('')).replaceAll('__SLUG__',card.slug);
}
