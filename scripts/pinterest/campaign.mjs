import fs from 'node:fs';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';
import GithubSlugger from 'github-slugger';
import { isEligible } from './content.mjs';

export const LAYOUTS = ['focus','question','dossier','repere','lecture','perspective'];
export const CAMPAIGN_SIZE = 730;

/** Read the actual passage behind each card; never infer a claim from a headline. */
export function readAngleSources(post, root) {
  const file = `src/content/blog/${post.category}/${post.slug}.md`;
  const body = fs.readFileSync(path.join(root,file),'utf8').replace(/^---[\s\S]*?\n---\s*\n/,'');
  const nodes = unified().use(remarkParse).parse(body).children;
  const slugger = new GithubSlugger(), sources = [];
  for (let i=0;i<nodes.length;i++) {
    if (nodes[i].type !== 'heading') continue;
    const heading = toString(nodes[i]), anchor = slugger.slug(heading);
    if (nodes[i+1]?.type === 'paragraph') sources.push({kind:'section',file,heading,anchor,text:toString(nodes[i+1]).replace(/\s+/g,' ').trim()});
  }
  for (const faq of post.faq || []) sources.push({kind:'faq',file,heading:faq.question,text:faq.answer});
  return sources;
}

export function validateVariants(variants, archive, posts, config, root) {
  if (archive.length + variants.length !== CAMPAIGN_SIZE) throw new Error('Expected exactly 730 campaign pins');
  const bySlug = new Map(posts.map(post=>[post.slug,post]));
  const original = new Map(archive.map(entry=>[entry.slug,entry]));
  const ids = new Set(), titles = new Set(), dates = new Set(archive.map(entry=>new Date(entry.releaseAt).getTime()));
  const lastBySlug = new Map(archive.map(entry=>[entry.slug,new Date(entry.releaseAt).getTime()]));
  const sources = new Map();
  const endOfArchive = Math.max(...dates);
  let previousRelease = endOfArchive;
  for (const pin of variants) {
    const post = bySlug.get(pin.slug), release = new Date(pin.releaseAt);
    if (!post || !original.has(pin.slug) || post.category !== pin.category) throw new Error(`Unknown variant article: ${pin.slug}`);
    if (!new RegExp(`^${pin.slug}--angle-[0-9]{2}$`).test(pin.pinId) || ids.has(pin.pinId)) throw new Error('Invalid/duplicate pin ID');
    if (!LAYOUTS.includes(pin.layout)) throw new Error('Unknown pin layout');
    if (typeof pin.title !== 'string' || pin.title.length < 15 || pin.title.length > 100 || titles.has(pin.title.toLocaleLowerCase('fr'))) throw new Error(`Invalid/duplicate pin title: ${pin.pinId}`);
    if (typeof pin.description !== 'string' || pin.description.length < 40 || pin.description.length > 430 || /[<>]/.test(pin.description)) throw new Error(`Invalid pin description: ${pin.pinId}`);
    if (!Number.isFinite(+release) || +release <= previousRelease || dates.has(+release) || !config.archiveWeekdaysUtc.includes(release.getUTCDay()) || release.getUTCHours() !== config.archiveHourUtc || release.getUTCMinutes() || release.getUTCSeconds() || release.getUTCMilliseconds()) throw new Error(`Invalid variant slot: ${pin.pinId}`);
    if (+release - lastBySlug.get(pin.slug) < 28 * 86_400_000) throw new Error(`Variants must be at least 28 days apart: ${pin.slug}`);
    if (root) {
      if (!sources.has(pin.slug)) sources.set(pin.slug,readAngleSources(post,root));
      const source = sources.get(pin.slug).find(source=>source.kind===pin.source?.kind && source.heading===pin.source?.heading && source.file===pin.source?.file && source.anchor===pin.source?.anchor);
      if (!source || !source.text.startsWith(pin.description)) throw new Error(`Source changed; review this pin before publishing: ${pin.pinId}`);
    }
    ids.add(pin.pinId); titles.add(pin.title.toLocaleLowerCase('fr')); dates.add(+release); lastBySlug.set(pin.slug,+release);
    previousRelease = +release;
  }
}

export function materializeVariant(pin, post) {
  return {...post, articleTitle:post.title, title:pin.title, seoDescription:pin.description,
    pinId:pin.pinId, pinLayout:pin.layout, pinSource:pin.source, releaseAt:pin.releaseAt, initial:false, kind:'variant'};
}

export function releasedVariants(posts, variants, config, now, windowOnly = true) {
  const bySlug = new Map(posts.map(post=>[post.slug,post]));
  const lower = now.getTime() - config.feedWindowDays * 86_400_000;
  return variants.filter(pin=>{
    const post=bySlug.get(pin.slug), release=+new Date(pin.releaseAt);
    return post && isEligible(post,config,now) && release <= +now && (!windowOnly || release > lower);
  }).map(pin=>materializeVariant(pin,bySlug.get(pin.slug)));
}
