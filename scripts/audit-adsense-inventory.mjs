/** Read-only HTML audit; optional captured production responses stay outside the repository. */
import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';
const origin='https://blogdungaucher.com';
const output='docs/audit-adsense-2026';
const content=fs.existsSync(`${output}/content-inventory.json`)?JSON.parse(fs.readFileSync(`${output}/content-inventory.json`,'utf8')):[];
const contentByUrl=new Map(content.map(r=>[r.url,r]));
fs.mkdirSync(output,{recursive:true});
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
function analyze(html,url,source,status=null,finalUrl=url){
 const $=load(html); const main=$('main').first(); const body=(main.length?main:$('body')).clone();
 body.find('script,style,nav,footer,header,.toc,.table-of-contents,aside').remove();
 const text=body.text().replace(/\s+/g,' ').trim();
 const article=$('[data-pagefind-body]').first(); const editorial=(article.length?article:body).clone(); editorial.find('script,style,nav,aside').remove();
 const words=editorial.text().trim().split(/\s+/u).filter(Boolean).length;
 const canonical=$('link[rel=canonical]').attr('href')??''; const robots=$('meta[name=robots]').attr('content')??'';
 const redirect=$('meta[http-equiv="refresh" i]').attr('content')??'';
 const title=$('title').text(); const description=$('meta[name=description]').attr('content')??'';
 const alternates=$('link[rel=alternate][hreflang]').map((_,e)=>({lang:$(e).attr('hreflang'),url:$(e).attr('href')})).get();
 const links=$('a[href]').map((_,e)=>$(e).attr('href')).get();
 const problems=[]; if(!redirect){if(!title)problems.push('title absent'); if(!description)problems.push('description absente'); if(!canonical)problems.push('canonical absent'); if($('h1').length!==1)problems.push(`H1: ${$('h1').length}`);}
 if(canonical&&canonical!==finalUrl&&!redirect&&status!==404)problems.push('canonical différent de URL');
 let badJson=0; const schemas=[]; $('script[type="application/ld+json"]').each((_,e)=>{try{const j=JSON.parse($(e).text());schemas.push(j);}catch{badJson++;}}); if(badJson)problems.push('JSON-LD invalide');
 const p=new URL(url).pathname; const type=redirect?'redirection':/\/blog\/[^/]+\//.test(p)&&! /\/blog\/\d+\//.test(p)?'article':/\/dissertations\/[^/]+\//.test(p)?'dissertation':/\/series\//.test(p)?'série':/\/(science|esprit|societe|grand-oral)\/$/.test(p)?'catégorie':p.includes('recherche')?'recherche':'page';
 const indexable=! /noindex/i.test(robots)&&!redirect&&status!==404;
 if(type==='article'&&words<350)problems.push('texte court à examiner, pas un verdict thin content');
 if(type==='article'&&/traduction|translation|tradução/i.test(text.slice(0,1200))&&/not yet|pas encore|indisponible|ainda não/i.test(text.slice(0,1200)))problems.push('traduction potentiellement absente');
 const images=$('img').length; const noAlt=$('img:not([alt])').length; if(noAlt)problems.push(`${noAlt} images sans attribut alt`);
 const headings=$('h1,h2,h3,h4,h5,h6').map((_,e)=>({level:Number(e.tagName.slice(1)),text:$(e).text().trim()})).get();
 if(headings.some((h,i)=>i&&h.level>headings[i-1].level+1))problems.push('saut de niveau de titre');
 const entry=contentByUrl.get(finalUrl);
 let contentFile=entry?.file??(type==='article'?`src/pages/${p.split('/')[1]}/blog/[slug].astro`:type==='série'?`src/pages${p}index.astro`:type==='catégorie'?'src/components/CategoryPage.astro':`src/pages${p}index.astro`);
 if(!entry){const candidates=[`src/pages${p.replace(/\/$/,'')}.astro`,`src/pages${p}index.astro`];const found=candidates.find(f=>fs.existsSync(f));if(found)contentFile=found;else if(type==='redirection')contentFile='astro.config.mjs / scripts/en-redirects.mjs';else if(/\/blog\/(?:\d+\/)?$/.test(p))contentFile=`src/pages/${p.split('/')[1]}/blog/[...page].astro`;}
 return {contentFile,url,lang:$('html').attr('lang')??'',type,source,status,finalUrl,indexable,robots,canonical,title,description,words,value:type==='article'||type==='dissertation'?`${words} mots rendus; ${entry?.referenceSection?'bibliographie repérée':'bibliographie non repérée automatiquement'}; portée des sources à vérifier`:type==='catégorie'?'orientation et extraits; faible texte autonome':type==='redirection'?'technique':type==='recherche'?'utilitaire':'à apprécier selon la fonction',problems,priority:problems.some(p=>/absent|invalide|H1/.test(p))?'P2':problems.length?'P3':'—',redirect,alternates,links,schemas,images,noAlt,headings,excerpt:text.slice(0,380)};
}
const local=walk('dist').filter(f=>f.endsWith('.html')).map(f=>{const p='/'+path.relative('dist',f).replaceAll(path.sep,'/').replace(/index\.html$/,'');return analyze(fs.readFileSync(f,'utf8'),origin+p,f);});
const responses=process.argv[2]?JSON.parse(fs.readFileSync(process.argv[2],'utf8')):[];
const live=responses.filter(r=>/text\/html/i.test(r.headers?.['Content-Type']??r.headers?.['content-type']??'')).map(r=>analyze(r.body,origin+r.path,'production',r.status,r.final??origin+r.path));
for(const [name,rows] of [['local',local],...(process.argv[2]?[['production',live]]:[])]){
 const index=new Map(rows.map(r=>[r.url,r]));
 for(const r of rows){ r.badAlternates=r.alternates.filter(a=>index.has(a.url)&&(!index.get(a.url).indexable||index.get(a.url).redirect)); if(r.badAlternates.length)r.problems.push('hreflang vers page non indexable/redirigée'); }
 fs.writeFileSync(`${output}/inventory-${name}.json`,JSON.stringify(rows,null,2));
 const esc=s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ');
 fs.writeFileSync(`${output}/inventory-${name}.md`,`# Inventaire ${name}\n\nLes mots sont une estimation du texte principal rendu, sans navigation, scripts ou pied de page. La longueur seule ne détermine pas la qualité. Indexabilité = directive HTML observée, pas preuve d’indexation Google. Statut — = non mesuré ; un fichier local ne prouve pas un HTTP 200.\n\n| URL | Langue | Type | HTTP | Indexable HTML | Canonical | Title | Description | Mots ≈ | Valeur | Problèmes | Priorité | Source | Fichier source probable |\n|---|---|---|---|---|---|---|---|---:|---|---|---|---|---|\n`+rows.map(r=>[r.url,r.lang,r.type,r.status??'—',r.indexable?'oui':'non',r.canonical,r.title,r.description,r.words,r.value,r.problems.join('; ')||'aucun signal automatique',r.priority,r.source,r.contentFile].map(esc).join(' | ')).map(s=>'| '+s+' |').join('\n')+'\n');
}
const sitemap=load(fs.readFileSync('dist/sitemap.xml','utf8'),{xmlMode:true});const locs=sitemap('url > loc').map((_,e)=>sitemap(e).text()).get(); const idx=new Map(local.map(r=>[r.url,r]));
const summary={localPages:local.length,productionHtmlResponses:live.length,productionUniqueFinalUrls:new Set(live.map(r=>r.finalUrl)).size,localTypes:Object.fromEntries([...new Set(local.map(r=>r.type))].map(t=>[t,local.filter(r=>r.type===t).length])),sitemapEntries:locs.length,sitemapMissing:locs.filter(u=>!idx.has(u)),sitemapNoindex:locs.filter(u=>idx.has(u)&&!idx.get(u).indexable),localBadAlternates:local.filter(r=>r.badAlternates.length).map(r=>({url:r.url,alternates:r.badAlternates})),liveProblems:live.filter(r=>r.problems.length).map(r=>({url:r.url,problems:r.problems})),localShortArticles:local.filter(r=>r.type==='article'&&r.words<350).map(r=>({url:r.url,words:r.words})),statusCounts:Object.fromEntries([...new Set(responses.map(r=>r.status))].map(s=>[s,responses.filter(r=>r.status===s).length]))};
fs.writeFileSync(`${output}/summary.json`,JSON.stringify(summary,null,2));
console.log(JSON.stringify({...summary,localBadAlternates:summary.localBadAlternates.length,liveProblems:summary.liveProblems.length},null,2));
