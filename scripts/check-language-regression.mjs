/** Compare the built site's routes, SEO metadata and article text with a saved baseline. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const walk = d => fs.readdirSync(d, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(d,e.name)) : [path.join(d,e.name)]);
const pages = walk('dist').filter(f => f.endsWith('.html')).map(f => {
  const $ = load(fs.readFileSync(f,'utf8'));
  return {
    path:f.slice(4).replace(/index\.html$/,''), lang:$('html').attr('lang'),
    title:$('title').text(), canonical:$('link[rel=canonical]').attr('href'),
    description:$('meta[name=description]').attr('content'), robots:$('meta[name=robots]').attr('content'),
    h1:$('h1').map((_,e)=>$(e).text()).get(),
    body:$('[data-pagefind-body]').text().replace(/\s+/g,' ').trim(),
    alternates:$('link[hreflang]').map((_,e)=>[$(e).attr('hreflang')+' '+$(e).attr('href')]).get(),
  };
});
const summary = {pages:pages.length,languages:{},baselineCompared:false};
for (const [lang,htmlLang] of [['fr','fr'],['en','en'],['pt-br','pt-BR']]) {
  const home=pages.find(p=>p.path===`/${lang}/`);
  assert.ok(home, `Missing ${lang} homepage`);
  assert.equal(home.lang.toLowerCase(),htmlLang.toLowerCase());
  assert.equal(home.h1.length,1);
  const articles=pages.filter(p=>p.path.startsWith(`/${lang}/blog/`)&&p.body);
  assert.ok(articles.length>0, `Missing ${lang} articles`);
  for(const p of articles){assert.equal(p.lang.toLowerCase(),htmlLang.toLowerCase(),p.path);assert.equal(p.h1.length,1,p.path);assert.ok(p.title&&p.description&&p.canonical,p.path);}
  summary.languages[lang]={articles:articles.length,homepage:true};
}
if(process.argv[2]){
  const before=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  assert.deepEqual(pages.map(p=>p.path).sort(),before.map(p=>p.path).sort(),'Route set changed');
  const current=new Map(pages.map(p=>[p.path,p]));
  const changes=[];
  const typographyOnlyChanges=[];
  for(const old of before){const now=current.get(old.path);for(const key of ['lang','title','canonical','description','robots','h1','body','alternates'])if(JSON.stringify(old[key])!==JSON.stringify(now[key])){if(key==='body'&&old[key].replace(/[“”]/g,'"')===now[key].replace(/[“”]/g,'"'))typographyOnlyChanges.push(old.path);else changes.push({path:old.path,field:key});}}
  summary.baselineCompared=true;summary.changes=changes;summary.typographyOnlyChanges=typographyOnlyChanges;
  console.log(JSON.stringify(summary,null,2));
  assert.equal(changes.length,0,'Built content or SEO metadata changed; inspect the listed differences.');
}else console.log(JSON.stringify(summary,null,2));
