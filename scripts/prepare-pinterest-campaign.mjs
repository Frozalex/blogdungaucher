import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { readPosts, isEligible } from './pinterest/content.mjs';
import { validateArchive } from './pinterest/calendar.mjs';
import { validateVariants, materializeVariant } from './pinterest/campaign.mjs';
import { articleUrl, imageName, pinGuid, pinTitle, escapeXml, plain } from './pinterest/feed.mjs';
import { renderVisual } from './pinterest/visual.mjs';

// Offline preparation is separate from live RSS; it must never expose future entries.
const output = path.resolve('work/pinterest-preview-campaign');
const config = JSON.parse(await fs.readFile('scripts/pinterest/config.json'));
const archive = JSON.parse(await fs.readFile('scripts/pinterest/archive.json'));
const variants = JSON.parse(await fs.readFile('scripts/pinterest/variants.json'));
const posts = readPosts('src/content/blog'), bySlug = new Map(posts.map(post=>[post.slug,post]));
validateArchive(archive,posts,config);
validateVariants(variants,archive,posts,config,process.cwd());
const pins = archive.map(entry=>({...bySlug.get(entry.slug),...entry,kind:'archive'}))
  .concat(variants.map(pin=>materializeVariant(pin,bySlug.get(pin.slug))));
if (pins.some(pin=>!isEligible(bySlug.get(pin.slug),config,new Date()))) throw new Error('Campaign source must already be public');
await fs.mkdir(path.join(output,'images'),{recursive:true});
const manifests = [], hashes = new Set();
for (const [index,pin] of pins.entries()) {
  const buffer = await renderVisual(pin,config.categories[pin.category],path.resolve('public'));
  const info = await sharp(buffer).metadata();
  if (info.width!==1000 || info.height!==1500 || info.format!=='jpeg') throw new Error(`Invalid visual: ${imageName(pin)}`);
  const sha256 = createHash('sha256').update(buffer).digest('hex');
  if (hashes.has(sha256)) throw new Error('Duplicate campaign visual');
  hashes.add(sha256);
  const image = `images/${imageName(pin)}.jpg`;
  await fs.writeFile(path.join(output,image),buffer);
  manifests.push({number:index+1,id:imageName(pin),guid:pinGuid(pin,config),article:pin.slug,
    category:pin.category,board:config.categories[pin.category].board,title:pinTitle(pin),
    description:plain(pin.seoDescription||pin.excerpt),releaseAt:pin.releaseAt,
    releaseGuadeloupe:new Intl.DateTimeFormat('fr-FR',{timeZone:'America/Guadeloupe',dateStyle:'long',timeStyle:'short'}).format(new Date(pin.releaseAt)),
    url:articleUrl(pin,config),image,sha256,source:pin.pinSource || {file:`src/content/blog/${pin.category}/${pin.slug}.md`,kind:'article'},
    credit:pin.heroImage.sourceUrl ? `${pin.heroImage.credit} (${pin.heroImage.license}) ${pin.heroImage.sourceUrl}` : null});
  if ((index+1)%50===0 || index===pins.length-1) console.log(`[campaign] ${index+1}/${pins.length} cards rendered and verified`);
}
await fs.writeFile(path.join(output,'programme.json'),JSON.stringify(manifests,null,2)+'\n');
const columns=['number','id','category','board','title','description','releaseAt','releaseGuadeloupe','url','image','credit'];
const csvCell=value=>'"'+String(value??'').replaceAll('"','""')+'"';
await fs.writeFile(path.join(output,'calendrier.csv'),'\uFEFF'+[columns,...manifests.map(pin=>columns.map(key=>pin[key]))].map(row=>row.map(csvCell).join(';')).join('\r\n'));
const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>730 épingles · Blog d’un Gaucher</title>
<style>body{margin:0;background:#faf8ef;color:#1c1a16;font:16px system-ui}header{padding:32px;max-width:1100px;margin:auto}h1{font-size:36px}nav{display:flex;gap:16px;flex-wrap:wrap}input,select{font:inherit;padding:10px;border:1px solid #9b9384;border-radius:8px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:24px;padding:24px}article{background:white;border:1px solid #e9e4d8;border-radius:12px;overflow:hidden}img{width:100%;height:auto}article div{padding:18px}h2{font-size:18px}small{color:#555}a{color:#254e6a}article[hidden]{display:none}</style>
<header><h1>730 épingles préparées</h1><p>72 cartes d’article et 658 angles distincts. Chaque visuel mesure 1 000 × 1 500 pixels.</p><p>Calendrier de mise à disposition dans les flux RSS : du 27 octobre 2026 au 24 juin 2031, à 10 h en Guadeloupe. Les nouveautés du blog restent en supplément. Pinterest décide de l’importation effective.</p><nav><a href="calendrier.csv">Télécharger le calendrier</a><a href="programme.json">Programme détaillé et sources</a></nav><p><input id="q" aria-label="Rechercher" placeholder="Chercher un titre ou un article"> <select id="category" aria-label="Rubrique"><option value="">Toutes les rubriques</option value="science">Science</option><option value="esprit">Esprit</option><option value="societe">Société</option></select> <span id="count">730 épingles</span></p></header><main>
${manifests.map(pin=>`<article data-category="${pin.category}" data-search="${escapeXml((pin.title+' '+pin.article).toLocaleLowerCase('fr'))}"><a href="${pin.image}"><img loading="lazy" src="${pin.image}" width="1000" height="1500" alt="${escapeXml(pin.title)}"></a><div><small>N° ${pin.number} · ${escapeXml(pin.releaseGuadeloupe)}</small><h2>${escapeXml(pin.title)}</h2><p>${escapeXml(pin.description)}</p><p><a href="${escapeXml(pin.url)}">Lire l’article</a> · ${escapeXml(pin.board)}</p>${pin.credit?`<small>${escapeXml(pin.credit)}</small>`:''}</div></article>`).join('\n')}
</main><script>const cards=[...document.querySelectorAll('article')],q=document.querySelector('#q'),category=document.querySelector('#category');function filter(){let n=0;for(const card of cards){card.hidden=!(card.dataset.search.includes(q.value.toLocaleLowerCase('fr'))&&(!category.value||card.dataset.category===category.value));if(!card.hidden)n++}document.querySelector('#count').textContent=n+' épingles'}q.addEventListener('input',filter);category.addEventListener('change',filter);</script></html>`;
await fs.writeFile(path.join(output,'index.html'),html);
console.log(`[campaign] 730 unique visuals, calendar and gallery → ${output}`);
