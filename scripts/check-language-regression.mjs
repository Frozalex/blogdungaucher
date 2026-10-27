/** Compare the built site's routes, SEO metadata and article text with a saved baseline. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import { NL_LAUNCH_DATE } from '../src/data/language-launch.mjs';

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
const launchedNl = new Date() >= NL_LAUNCH_DATE;
// The apex must remain a usable language chooser, including without JavaScript.
const rootHtml = fs.readFileSync('dist/index.html', 'utf8');
const rootPage = load(rootHtml);
assert.equal(rootPage('h1').length, 1, 'Missing language chooser heading');
assert.equal(rootPage('link[rel=canonical]').attr('href'), 'https://blogdungaucher.com/');
assert.equal(rootPage('meta[http-equiv="refresh" i]').length, 0, 'Apex still redirects');
assert.doesNotMatch(rootHtml, /(?:window\.)?location\.(?:replace|assign)\s*\(/, 'Apex must wait for a language choice');
const choices = rootPage('nav a[hreflang]').map((_, e) => rootPage(e).attr('href')).get();
assert.deepEqual(choices, ['/fr/', '/en/', '/pt-br/', ...(launchedNl ? ['/nl/'] : [])]);
for (const href of choices) assert.ok(pages.some(p => p.path === href), `Missing language destination ${href}`);
for (const file of ['deploy/nginx-redirects.conf', 'scripts/gen-nginx-redirects.mjs']) {
  assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /location\s*=\s*\/\s*\{[^}]*return\s+30[1278]/, `${file} redirects the apex before the chooser`);
}

const languages = [['fr','fr'],['en','en'],['pt-br','pt-BR'], ...(launchedNl ? [['nl','nl']] : [])];
if (!launchedNl) assert.equal(pages.filter(p => p.path.startsWith('/nl/blog/') && p.body).length, 0, 'NL articles exposed before launch');
for (const [lang,htmlLang] of languages) {
  const home=pages.find(p=>p.path===`/${lang}/`);
  assert.ok(home, `Missing ${lang} homepage`);
  assert.equal(home.lang.toLowerCase(),htmlLang.toLowerCase());
  assert.equal(home.h1.length,1);
  const articles=pages.filter(p=>p.path.startsWith(`/${lang}/blog/`)&&p.body);
  assert.ok(articles.length>0, `Missing ${lang} articles`);
  for(const p of articles){assert.equal(p.lang.toLowerCase(),htmlLang.toLowerCase(),p.path);assert.equal(p.h1.length,1,p.path);assert.ok(p.title&&p.description&&p.canonical,p.path);}
  const pagefind = fs.readdirSync('dist/pagefind');
  assert.ok(pagefind.some(file => file.startsWith(`pagefind.${lang}_`) && file.endsWith('.pf_meta')), `Missing ${lang} search index`);
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
