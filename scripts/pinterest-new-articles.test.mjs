import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newArticleReleases} from './pinterest/new-articles.mjs';import {selectFeedItems} from './pinterest/calendar.mjs';
const base=JSON.parse(fs.readFileSync('scripts/pinterest/config.json'));
const config={...base,newArticleDelivery:{from:'2026-11-23T00:00:00Z',metricool:[{slug:'managed',releaseAt:'2026-11-23T14:00:00Z'}]}};
const p=(slug,date)=>({slug,publishedAt:date,category:'science'});
test('new RSS uses complementary slots and skips Metricool posts and reservations',()=>{
 const posts=[p('managed','2026-11-23T00:00:00Z'),p('a','2026-11-23T00:00:00Z'),p('b','2026-11-24T00:00:00Z'),p('c','2026-11-26T00:00:00Z')];
 const plan=newArticleReleases(posts,config);assert.equal(plan.has('managed'),false);
 assert.deepEqual([...plan.values()],['2026-11-26T14:00:00.000Z','2026-11-30T14:00:00.000Z','2026-12-03T14:00:00.000Z']);
 assert.deepEqual(newArticleReleases([...posts].reverse(),config),plan);
 assert.equal(selectFeedItems(posts,[],config,new Date('2026-11-26T13:59:59Z')).length,0);
 assert.deepEqual(selectFeedItems(posts,[],config,new Date('2026-11-26T14:00:00Z')).map(p=>p.slug),['a']);
});
test('old RSS entries retain their dates; hidden articles never occupy slots',()=>{
 const old=p('old','2026-11-20T00:00:00Z');assert.equal(selectFeedItems([old],[],config,new Date('2026-11-25'))[0].releaseAt,'2026-11-20T00:00:00.000Z');
 assert.equal(newArticleReleases([{...p('a','2026-11-24'),draft:true},{...p('b','2026-11-24'),noindex:true}],config).size,0);
});
test('duplicate remote reservations are rejected',()=>{assert.throws(()=>newArticleReleases([],{...config,newArticleDelivery:{...config.newArticleDelivery,metricool:[...config.newArticleDelivery.metricool,...config.newArticleDelivery.metricool]}}));});

test('production plan reserves two complementary posts per week without altering historical RSS',async()=>{
 const {readPosts}=await import('./pinterest/content.mjs');
 const posts=readPosts('src/content/blog');const archive=JSON.parse(fs.readFileSync('scripts/pinterest/archive.json'));const variants=JSON.parse(fs.readFileSync('scripts/pinterest/variants.json'));
 const old={...base};delete old.newArticleDelivery;
 const now=new Date('2026-11-22T23:59:59Z');assert.deepEqual(selectFeedItems(posts,archive,base,now,variants),selectFeedItems(posts,archive,old,now,variants));
 const bySlug=new Map(posts.map(p=>[p.slug,p]));const weeks=new Map();const entries=[...base.newArticleDelivery.metricool,...[...newArticleReleases(posts,base)].map(([slug,releaseAt])=>({slug,releaseAt}))];
 for(const e of entries){assert.ok(new Date(e.releaseAt)>=new Date(bySlug.get(e.slug).publishedAt));const d=new Date(e.releaseAt);d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);const key=d.toISOString().slice(0,10);weeks.set(key,(weeks.get(key)||0)+1);}
 assert.ok([...weeks.values()].every(n=>n<=2));assert.equal(base.newArticleDelivery.metricool.length,134);
});
