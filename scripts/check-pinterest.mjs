import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { load } from 'cheerio';
import { readPosts, isEligible } from './pinterest/content.mjs';
import { selectFeedItems } from './pinterest/calendar.mjs';
import { releasedVariants, validateVariants } from './pinterest/campaign.mjs';
import { articleUrl, imageName, pinGuid } from './pinterest/feed.mjs';

const preview = process.argv.includes('--preview');
const directory = process.argv.find(arg=>arg.startsWith('--dir='))?.slice(6) || (preview ? 'work/pinterest-preview' : 'dist/pinterest');
const status = JSON.parse(fs.readFileSync(path.join(directory,'status.json')));
const now = new Date(status.generatedAt);
const config = JSON.parse(fs.readFileSync('scripts/pinterest/config.json'));
const archive = JSON.parse(fs.readFileSync('scripts/pinterest/archive.json'));
const variants = JSON.parse(fs.readFileSync('scripts/pinterest/variants.json'));
const posts = readPosts('src/content/blog');
validateVariants(variants,archive,posts,config,process.cwd());
assert.equal(status.campaignPlanned,730);
assert.equal(status.variantsPlanned,658);
const expected = selectFeedItems(posts,archive,config,now,variants);
const seen = new Set();
for (const category of Object.keys(config.categories)) {
  const xml = fs.readFileSync(path.join(directory,`${category}.xml`),'utf8');
  const $ = load(xml,{xml:true});
  assert.equal($('rss').attr('version'),'2.0');
  assert.equal($('channel > language').text(),'fr-FR');
  const items = $('channel > item').toArray();
  assert.equal(items.length,expected.filter(item=>item.category===category).length,category);
  if (now >= new Date(config.initialReleaseAt) && now < new Date(config.startsAt)) assert.ok(items.length > 0, `Empty initial feed: ${category}`);
  for (const item of items) {
    const element = $(item);
    const guid = element.find('guid').text();
    assert.ok(!seen.has(guid),'Duplicate GUID'); seen.add(guid);
    const post = expected.find(post=>pinGuid(post,config)===guid);
    assert.ok(post,`Unexpected item: ${guid}`);
    assert.equal(post.category,category);
    assert.ok(isEligible(post,config,now));
    assert.equal(element.find('link').text(),articleUrl(post,config));
    assert.ok(element.find('title').text()); assert.ok(element.find('description').text());
    assert.equal(element.find('pubDate').text(),new Date(post.releaseAt).toUTCString());
    const media = element.find('media\\:content');
    assert.equal(media.length,1);
    assert.equal(element.find('enclosure, img').length,0);
    const url = new URL(media.attr('url'));
    assert.equal(url.origin,config.origin);
    assert.equal(url.pathname,`/pinterest/images/${imageName(post)}.jpg`);
    assert.equal(media.attr('type'),'image/jpeg');
    const info = await sharp(path.join(directory,'images',`${imageName(post)}.jpg`)).metadata();
    assert.deepEqual([info.width,info.height,info.format],[1000,1500,'jpeg']);
    if (!preview) {
      const html = fs.readFileSync(path.join('dist/fr/blog',post.slug,'index.html'),'utf8');
      const page = load(html);
      assert.equal(page('html').attr('lang'),'fr');
      assert.equal(page('meta[http-equiv="refresh"]').length,0,`Redirect article: ${post.slug}`);
      assert.ok(!/noindex/i.test(page('meta[name="robots"]').attr('content') || ''),post.slug);
    }
  }
}
const images = fs.readdirSync(path.join(directory,'images'));
assert.equal(images.length,posts.filter(post=>isEligible(post,config,now)).length + releasedVariants(posts,variants,config,now,false).length);
for (const image of images) {
  const info = await sharp(path.join(directory,'images',image)).metadata();
  assert.deepEqual([info.width,info.height,info.format],[1000,1500,'jpeg'],image);
}
console.log(`[pinterest-check] 3 flux valides, ${seen.size} éléments uniques et ${images.length} visuels 1000×1500 (${preview ? `aperçu au ${now.toISOString()}` : 'build courant'}).`);
