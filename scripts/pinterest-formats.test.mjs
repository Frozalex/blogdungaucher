import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import{load}from'cheerio';
import{validateFormats,withFormats,rssOnly}from'./pinterest/formats.mjs';
import{readPosts}from'./pinterest/content.mjs';import{selectFeedItems}from'./pinterest/calendar.mjs';import{renderFeed,pinGuid,articleUrl,pinImagePath}from'./pinterest/feed.mjs';
const read=n=>JSON.parse(fs.readFileSync(`scripts/pinterest/${n}.json`)),config=read('config'),archive=read('archive'),variants=read('variants'),formats=read('formats'),posts=readPosts('src/content/blog');
test('the 730 slots are split into exactly 244 images, 243 videos, 243 PDFs',()=>{
 assert.deepEqual(validateFormats(formats,archive,variants),{image:244,video:243,pdf:243});
 for(const mutate of [f=>delete f[archive[0].slug],f=>f[archive[0].slug]='pdf',f=>f[archive[0].slug]='fake']){const f={...formats};mutate(f);assert.throws(()=>validateFormats(f,archive,variants));}
});
test('the three already exposed pins keep the same links, images and identities',()=>{
 const items=selectFeedItems(posts,archive,config,new Date('2026-10-28T15:00:00Z'),variants),mixed=withFormats(items,formats);
 assert.equal(mixed.length,3);assert.equal(rssOnly(mixed).length,3);
 for(let i=0;i<3;i++){assert.equal(mixed[i].mediaFormat,'image');assert.equal(articleUrl(items[i],config),articleUrl(mixed[i],config));assert.equal(pinGuid(items[i],config),pinGuid(mixed[i],config));assert.equal(pinImagePath(items[i]),pinImagePath(mixed[i]));}
});
test('PDF pins have a true PDF destination and a separate JPEG cover',()=>{
 const items=rssOnly(withFormats(selectFeedItems(posts,archive,config,new Date('2026-11-08T15:00:00Z'),variants),formats)),pin=items.find(p=>p.mediaFormat==='pdf');assert.ok(pin);
 const $=load(renderFeed(pin.category,[pin],config,new Date(pin.releaseAt)),{xml:true});
 assert.match(new URL($('item link').text()).pathname,/^\/pinterest-media\/pdf\/.+\.pdf$/);
 assert.match($('item media\\:content').attr('url'),/\/pinterest-media\/covers\/.+\.jpg$/);
 assert.match($('item description').text(),/^Fiche PDF à télécharger/);
 assert.equal(pinGuid(pin,config),`https://blogdungaucher.com/fr/blog/${pin.slug}/`);
});
test('video entries never masquerade as an image automatically published through RSS',()=>{
 const items=withFormats(selectFeedItems(posts,archive,config,new Date('2026-11-08T15:00:00Z'),variants),formats),video=items.find(p=>p.mediaFormat==='video');assert.ok(video);
 assert.ok(rssOnly(items).every(p=>p.mediaFormat!=='video'));
 assert.throws(()=>renderFeed(video.category,[video],config,new Date()),/Native video/);
});
test('new articles outside the fixed campaign still default to image RSS publication',()=>{
 const item={slug:'nouvel-article',category:'science'};assert.equal(withFormats([item],formats)[0].mediaFormat,'image');
});

test('all 486 media assets match their source articles and verified binary fingerprints',async()=>{
 const {validateMediaAssets}=await import('./pinterest/media/assets.mjs');
 const assets=validateMediaAssets(process.cwd(),formats);
 assert.equal(assets.filter(a=>a.format==='pdf').length,243);assert.equal(assets.filter(a=>a.format==='video').length,243);
 assert.equal(new Set(assets.map(a=>a.sha256)).size,486);
 for(const asset of assets.filter(a=>a.format==='video')){
  assert.equal(asset.video.codec,'h264');assert.equal(asset.video.frameRate,'24/1');assert.equal(asset.video.width,1080);assert.equal(asset.video.height,1920);assert.ok(asset.video.duration>=40&&asset.video.duration<=90);
  assert.deepEqual(asset.video.audio,{codec:'aac',channels:2,sampleRate:48000});assert.equal(asset.video.styleVersion,2);assert.equal(asset.video.noVoice,true);
 }
});
