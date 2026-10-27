import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPosts, isEligible } from './pinterest/content.mjs';
import { selectFeedItems, validateArchive } from './pinterest/calendar.mjs';
import { renderFeed, articleUrl } from './pinterest/feed.mjs';
import { renderVisual } from './pinterest/visual.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const match = arg.match(/^--(at|out)=(.+)$/);
  if (!match) throw new Error(`Unsupported argument: ${arg}`);
  return match.slice(1);
}));
const liveOutput = path.join(root,'public/pinterest');
const output = args.out ? path.resolve(args.out) : liveOutput;
if (args.at && (!args.out || output === liveOutput || output.startsWith(liveOutput + path.sep))) throw new Error('--at requires a separate preview --out directory');
if (output !== liveOutput && !output.startsWith(path.join(root,'work/pinterest-preview'))) throw new Error('Preview output must be inside work/pinterest-preview');
const now = args.at ? new Date(args.at) : new Date();
const config = JSON.parse(await fs.readFile(path.join(root,'scripts/pinterest/config.json'),'utf8'));
const archive = JSON.parse(await fs.readFile(path.join(root,'scripts/pinterest/archive.json'),'utf8'));
const posts = readPosts(path.join(root,'src/content/blog'));
validateArchive(archive,posts,config);
const items = selectFeedItems(posts,archive,config,now);
const temporary = `${output}.tmp`;
await fs.rm(temporary,{recursive:true,force:true});
await fs.mkdir(path.join(temporary,'images'),{recursive:true});
try {
  // Keep previously released image URLs available after they leave the RSS window.
  // Generate only published, eligible articles; no scheduled title is exposed early.
  const images = posts.filter(post => isEligible(post,config,now));
  for (const post of images) {
    const jpg = await renderVisual(post,config.categories[post.category],path.join(root,'public'));
    await fs.writeFile(path.join(temporary,'images',`${post.slug}.jpg`),jpg);
  }
  for (const category of Object.keys(config.categories)) {
    const selected = items.filter(post => post.category === category);
    await fs.writeFile(path.join(temporary,`${category}.xml`),renderFeed(category,selected,config,now));
    console.log(`[pinterest] ${category}: ${selected.length} éléments (${selected.filter(p=>p.kind==='archive').length} anciens)`);
  }
  const status = {
    generatedAt:now.toISOString(), startsAt:config.startsAt, feedWindowDays:config.feedWindowDays,
    note:'Exposition dans le flux, pas confirmation de publication Pinterest.',
    items:items.map(post=>({slug:post.slug,category:post.category,kind:post.kind,releaseAt:post.releaseAt,url:articleUrl(post,config)})),
    archivePlanned:archive.length,
    archiveSlotsElapsed:archive.filter(entry=>new Date(entry.releaseAt)<=now).length,
    unplannedOldArticles:posts.filter(post=>isEligible(post,config,now) && new Date(post.publishedAt)<new Date(config.archiveCutoff) && !archive.some(entry=>entry.slug===post.slug)).map(post=>post.slug),
  };
  if(status.unplannedOldArticles.length) console.warn('[pinterest] Anciens articles à planifier explicitement:',status.unplannedOldArticles.join(', '));
  await fs.writeFile(path.join(temporary,'status.json'),JSON.stringify(status,null,2)+'\n');
  await fs.mkdir(path.dirname(output),{recursive:true});
  await fs.rm(output,{recursive:true,force:true});
  await fs.rename(temporary,output);
  console.log(`[pinterest] ${images.length} visuels 1000×1500 générés → ${output}`);
} catch(error) {
  await fs.rm(temporary,{recursive:true,force:true});
  throw error;
}
