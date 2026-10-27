import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { load } from 'cheerio';
import { readPosts } from './pinterest/content.mjs';
import { createArchiveCalendar, selectFeedItems, validateArchive } from './pinterest/calendar.mjs';
import { renderFeed, articleUrl } from './pinterest/feed.mjs';
import { renderVisual, localHeroPath } from './pinterest/visual.mjs';

const config=JSON.parse(fs.readFileSync('scripts/pinterest/config.json'));
const archive=JSON.parse(fs.readFileSync('scripts/pinterest/archive.json'));
const posts=readPosts('src/content/blog');
const fixture=(slug,category='science',publishedAt='2026-10-01T00:00:00Z',extra={})=>({slug,category,publishedAt,title:'Échecs & mémoire <sans promesse>',excerpt:'Texte français.',heroImage:{src:'/images/fixture.png'},...extra});
const schedule=(slug,releaseAt='2026-11-03T14:00:00.000Z',category='science')=>({slug,releaseAt,category});
const week=date=>{const monday=new Date(date);monday.setUTCDate(monday.getUTCDate()-(monday.getUTCDay()+6)%7);return monday.toISOString().slice(0,10);};

test('frozen archive provides exactly three old articles a week across all categories',()=>{
 validateArchive(archive,posts,config);
 assert.equal(archive.length,72);
 const weeks=new Map();
 for(const entry of archive){const key=week(entry.releaseAt);weeks.set(key,(weeks.get(key)||0)+1);}
 assert.equal(weeks.size,24);assert.ok([...weeks.values()].every(count=>count===3));
 assert.deepEqual(archive.slice(0,3).map(x=>x.slug),['echecs-et-memoire','psychologie-du-joueur-d-echecs','echecs-et-argent']);
 assert.equal(new Intl.DateTimeFormat('fr',{timeZone:'America/Guadeloupe',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date(archive[0].releaseAt)).find(part=>part.type==='hour').value,'10');
});
test('calendar remains fixed when content order changes; exhausted categories lend their slots',()=>{
 const fixturePosts=[fixture('a'),fixture('b'),fixture('c','esprit'),fixture('d','societe'),fixture('e'),fixture('f')];
 const first=createArchiveCalendar(fixturePosts,config),second=createArchiveCalendar([...fixturePosts].reverse(),config);
 assert.deepEqual(first,second);assert.equal(first.length,6);assert.equal(new Set(first.map(x=>x.slug)).size,6);
 assert.equal(new Set(first.slice(0,3).map(x=>x.category)).size,3);
});
test('archive rejects duplicates, unknown slugs, category changes, wrong days and premature slots',()=>{
 const p=fixture('old'),good=schedule('old');
 for(const plan of [[good,good],[schedule('missing')],[{...good,category:'esprit'}],[schedule('old','2026-11-04T14:00:00Z')],[schedule('old','2026-11-03T13:00:00Z')],[schedule('old','2026-10-27T14:00:00Z')]])assert.throws(()=>validateArchive(plan,[p],config));
 assert.throws(()=>validateArchive([good],[fixture('old','science','2026-11-04T00:00:00Z')],config));
 assert.throws(()=>validateArchive([good,{...schedule('another'),releaseAt:'2026-11-03T14:00:00Z'}],[p,fixture('another')],config));
});
test('launch and slot boundaries are inclusive without exposing the archive early',()=>{
 const p=fixture('old'),plan=[schedule('old')];
 assert.deepEqual(selectFeedItems([p],plan,config,new Date('2026-11-03T13:59:59.999Z')),[]);
 assert.equal(selectFeedItems([p],plan,config,new Date('2026-11-03T14:00:00Z')).length,1);
 assert.deepEqual(selectFeedItems(posts,archive,config,new Date('2026-10-27T15:00:00Z')).filter(p=>!p.initial),[]);
});
test('new posts wait for their real publication date and are not consumed from the old queue',()=>{
 const p=fixture('new','societe','2026-11-09T06:00:00Z');
 assert.deepEqual(selectFeedItems([p],[],config,new Date('2026-11-09T05:59:59Z')),[]);
 assert.equal(selectFeedItems([p],[],config,new Date('2026-11-09T06:00:00Z'))[0].kind,'new');
});
test('drafts, noindex, foreign/Grand oral categories and unplanned old content stay out',()=>{
 const hidden=[fixture('draft','science',undefined,{draft:true}),fixture('hidden','science',undefined,{noindex:true}),fixture('oral','grand-oral'),fixture('foreign','en'),fixture('unplanned')];
 assert.deepEqual(selectFeedItems(hidden,[],config,new Date('2026-11-08T15:00:00Z')),[]);
 assert.deepEqual(selectFeedItems([hidden[0]],[schedule('draft')],config,new Date('2026-11-08T15:00:00Z')),[]);
});
test('late connection exposes at most six archive articles, not the full backlog',()=>{
 for(const date of ['2026-10-27T15:00:00Z','2026-11-08T15:00:00Z','2026-11-10T14:00:00Z','2026-12-20T23:00:00Z','2027-04-18T23:00:00Z']){
 const items=selectFeedItems(posts,archive,config,new Date(date)).filter(p=>p.kind==='archive');
 assert.ok(items.length<=6 && items.length>0,date);
 }
 assert.deepEqual(selectFeedItems([fixture('old')],[schedule('old')],config,new Date('2026-11-17T14:00:00Z')),[]);
});
test('RSS separates categories, escapes French text and supplies exactly one absolute JPEG',()=>{
 const item={...fixture('old'),releaseAt:'2026-11-03T14:00:00.000Z'};
 const xml=renderFeed('science',[item],config,new Date(item.releaseAt));
 assert.ok(xml.includes('&amp;'));assert.ok(xml.includes('&lt;sans promesse&gt;'));
 const $=load(xml,{xml:true});
 assert.equal($('item title').text(),item.title);
 assert.equal($('item guid').text(),articleUrl(item,config,false));
 assert.equal($('item link').text(),articleUrl(item,config));
 assert.equal(new URL($('item link').text()).origin,config.origin);
 assert.equal($('item media\\:content').length,1);
 assert.equal($('item media\\:content').attr('url'),'https://blogdungaucher.com/pinterest/images/old.jpg');
 assert.equal($('item enclosure, item img').length,0);
 assert.equal($('channel language').text(),'fr-FR');
 assert.throws(()=>renderFeed('science',[{...item,category:'societe'}],config,new Date()),/Mixed/);
});
test('GUIDs survive title changes and do not depend on tracking or the release date',()=>{
 const p=fixture('old');
 const guid=item=>load(renderFeed('science',[item],config,new Date()),{xml:true})('item guid').text();
 assert.equal(guid({...p,releaseAt:'2026-11-03T14:00:00Z'}),guid({...p,title:'Autre titre',releaseAt:'2026-11-10T14:00:00Z'}));
 assert.ok(!guid({...p,releaseAt:'2026-11-03T14:00:00Z'}).includes('utm_'));
});
test('photo credit, licence and source are retained in the RSS description',()=>{
 const p={...fixture('old'),releaseAt:'2026-11-03T14:00:00Z',heroImage:{src:'/images/a.jpg',sourceUrl:'https://example.org/photo',credit:'Auteur & Musée',license:'CC BY 4.0'}};
 const $=load(renderFeed('science',[p],config,new Date()),{xml:true});
 assert.match($('item description').text(),/Auteur & Musée \(CC BY 4.0\).*https:\/\/example.org\/photo/);
});
test('visuals are JPEG 1000×1500 and leave the existing illustration byte-for-byte intact',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'pinterest-art-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 fs.mkdirSync(path.join(dir,'images'));
 const original=await sharp({create:{width:1200,height:800,channels:3,background:'#5b9fd4'}}).png().toBuffer();
 const file=path.join(dir,'images/fixture.png');fs.writeFileSync(file,original);
 const p=fixture('unicode',undefined,undefined,{title:'Échecs : comprendre l’attention & le calcul'});
 const jpg=await renderVisual(p,config.categories.science,dir);
 const info=await sharp(jpg).metadata();assert.deepEqual([info.width,info.height,info.format],[1000,1500,'jpeg']);
 assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),createHash('sha256').update(original).digest('hex'));
 assert.throws(()=>localHeroPath(dir,{...p,heroImage:{src:'/images/../../secret.png'}}));
 assert.throws(()=>localHeroPath(dir,{...p,heroImage:{src:'https://example.org/image.jpg'}}));
 assert.throws(()=>localHeroPath(dir,{...p,heroImage:{src:'/images/fixture.png',sourceUrl:'https://example.org/photo'}}),/credit/);
});
test('frontmatter parser preserves folded descriptions and correctly reads a real draft flag',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'pinterest-yaml-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 fs.writeFileSync(path.join(dir,'draft.md'),'---\ntitle: "Échecs & mémoire"\ncategory: science\npublishDate: "2026-01-01"\ndraft: true\nexcerpt: >-\n  Une phrase\n  sur deux lignes.\n---\n');
 const parsed=readPosts(dir)[0];assert.equal(parsed.excerpt,'Une phrase sur deux lignes.');assert.equal(parsed.draft,true);
 assert.deepEqual(selectFeedItems([parsed],[],config,new Date('2026-11-08T15:00:00Z')),[]);
});
test('future-date preview cannot overwrite the production feed directory',()=>{
 const result=spawnSync(process.execPath,['scripts/generate-pinterest.mjs','--at=2026-11-08T15:00:00Z'],{encoding:'utf8'});
 assert.equal(result.status,1);assert.match(result.stderr,/requires a separate preview/);
});

test('initial feeds contain one real article per category as soon as the initial date is reached',()=>{
 assert.deepEqual(selectFeedItems(posts,archive,config,new Date('2026-10-27T13:59:59.999Z')),[]);
 const items=selectFeedItems(posts,archive,config,new Date('2026-10-27T14:00:00Z'));
 assert.equal(items.length,3);
 for(const category of Object.keys(config.categories)) {
  const selected=items.filter(p=>p.category===category);
  assert.equal(selected.length,1);assert.equal(selected[0].initial,true);
  assert.ok(selected[0].heroImage.src);
 }
});
test('initial articles are never scheduled a second time on the following week',()=>{
 const initial=archive.filter(p=>p.initial).map(p=>p.slug);
 assert.equal(archive.filter(p=>!p.initial).length,69);
 assert.ok(archive.filter(p=>!p.initial).every(p=>!initial.includes(p.slug)));
 const items=selectFeedItems(posts,archive,config,new Date('2026-11-08T15:00:00Z'));
 for(const slug of initial)assert.equal(items.filter(p=>p.slug===slug).length,1);
 assert.equal(items.filter(p=>p.kind==='archive'&&!p.initial).length,3);
});
test('initial release validates all three categories and rejects duplicate categories or arbitrary dates',()=>{
 const initial=archive.filter(p=>p.initial);
 assert.throws(()=>validateArchive(initial.slice(0,2),posts,config),/one article per category/);
 assert.throws(()=>validateArchive([{...initial[0],releaseAt:'2026-10-28T14:00:00Z'},...initial.slice(1)],posts,config),/initial/);
 assert.throws(()=>validateArchive([{...initial[0],initial:'true'},...initial.slice(1)],posts,config),/initial/);
 const fixtures=[fixture('a'),fixture('b')];
 assert.throws(()=>validateArchive(fixtures.map(p=>({...schedule(p.slug,config.initialReleaseAt),initial:true})),fixtures,config),/initial category/);
});
