import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import sharp from 'sharp';
import { load } from 'cheerio';
import { createHash } from 'node:crypto';
import { readPosts } from './pinterest/content.mjs';
import { selectFeedItems } from './pinterest/calendar.mjs';
import { validateVariants, materializeVariant, releasedVariants, LAYOUTS } from './pinterest/campaign.mjs';
import { renderFeed, pinGuid, articleUrl, imageName } from './pinterest/feed.mjs';
import { renderVisual } from './pinterest/visual.mjs';
const get=name=>JSON.parse(fs.readFileSync(`scripts/pinterest/${name}.json`));
const config=get('config'),archive=get('archive'),variants=get('variants'),posts=readPosts('src/content/blog');
const copy=value=>structuredClone(value);

test('730 distinct campaign pins have real source passages, unique dates and spaced angles',()=>{
 validateVariants(variants,archive,posts,config,process.cwd());
 assert.equal(archive.length+variants.length,730);
 const weeks=new Map();
 for(const entry of [...archive,...variants]){
  const date=new Date(entry.releaseAt);date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);
  const key=date.toISOString().slice(0,10);weeks.set(key,(weeks.get(key)||0)+1);
 }
 assert.ok([...weeks.values()].every(n=>n<=3));assert.equal(weeks.size,244);
 assert.equal(variants.at(-1).releaseAt,'2031-06-24T14:00:00.000Z');
 assert.equal(new Set(variants.map(p=>p.slug)).size,72);
});
test('invalid identities, slots, duplicate titles, missing source and misleading excerpt edits fail',()=>{
 for(const mutation of [
  v=>v[1].pinId=v[0].pinId,
  v=>v[1].title=v[0].title,
  v=>v[1].releaseAt=v[0].releaseAt,
  v=>v[0].releaseAt='2027-04-14T14:00:00.000Z',
  v=>v[0].layout='unknown',
  v=>v[0].slug='missing',
  v=>v[0].description='Une affirmation inventée qui ne figure absolument pas dans le passage source.',
  v=>v[0].source.anchor='wrong-anchor',
  v=>v.pop(),
 ]){const pins=copy(variants);mutation(pins);assert.throws(()=>validateVariants(pins,archive,posts,config,process.cwd()));}
});
test('every variant appears on its own day, never early, and leaves the 14-day feed window',()=>{
 for(const pin of variants){
  const release=+new Date(pin.releaseAt);
  const before=releasedVariants(posts,[pin],config,new Date(release-1));assert.equal(before.length,0);
  assert.equal(releasedVariants(posts,[pin],config,new Date(release)).length,1);
  assert.equal(releasedVariants(posts,[pin],config,new Date(release+14*86400000)).length,0);
  assert.equal(releasedVariants(posts,[pin],config,new Date(release+14*86400000),false).length,1);
 }
 for(const date of ['2027-04-13T14:00:00Z','2028-02-29T14:00:00Z','2031-06-24T14:00:00Z']){
  assert.ok(selectFeedItems(posts,archive,config,new Date(date),variants).filter(p=>p.kind!=='new').length<=6);
 }
});
test('withdrawn articles never reappear through variants',()=>{
 const pin=variants[0],p=posts.find(p=>p.slug===pin.slug),now=new Date(pin.releaseAt);
 for(const extra of [{draft:true},{noindex:true},{publishedAt:'2099-01-01'}]){
  assert.deepEqual(releasedVariants([{...p,...extra}],[pin],config,now,false),[]);
 }
});
test('old GUIDs remain intact; each new angle has a stable separate identity and image',()=>{
 const pin=variants[0],post=posts.find(p=>p.slug===pin.slug),item=materializeVariant(pin,post);
 assert.equal(pinGuid(post,config),`https://blogdungaucher.com/fr/blog/${post.slug}/`);
 const guid=pinGuid(item,config);assert.match(guid,/^urn:blogdungaucher:pinterest:/);
 assert.equal(pinGuid({...item,title:'Titre révisé',releaseAt:'2030-01-01'},config),guid);
 assert.notEqual(guid,pinGuid(post,config));
 const $=load(renderFeed(item.category,[item],config,new Date(item.releaseAt)),{xml:true});
 assert.equal($('item guid').attr('isPermaLink'),'false');assert.equal($('item guid').text(),guid);
 assert.equal($('item title').text(),pin.title);assert.equal($('item description').text(),pin.description);
 assert.equal($('item media\\:content').attr('url'),`${config.origin}/pinterest/images/${imageName(item)}.jpg`);
 const url=new URL(articleUrl(item,config));assert.equal(url.origin,config.origin);
 assert.equal(decodeURIComponent(url.hash.slice(1)),pin.source.anchor);
 assert.equal(url.searchParams.get('utm_content'),pin.pinId);
});
test('six angle layouts produce distinct vertical JPEGs without altering the cover',async()=>{
 const pin=variants[0],post=posts.find(p=>p.slug===pin.slug),file=`public${post.heroImage.src}`;
 const hash=buffer=>createHash('sha256').update(buffer).digest('hex'),before=hash(fs.readFileSync(file)),images=new Set();
 for(const layout of LAYOUTS){
  const item=materializeVariant({...pin,layout},post),buffer=await renderVisual(item,config.categories[post.category],'public');
  const info=await sharp(buffer).metadata();assert.deepEqual([info.width,info.height,info.format],[1000,1500,'jpeg']);images.add(hash(buffer));
 }
 assert.equal(images.size,6);assert.equal(hash(fs.readFileSync(file)),before);
});
