import { isEligible } from './content.mjs';

const DAY = 86_400_000;
export function validateConfig(config) {
  if (config.origin !== 'https://blogdungaucher.com') throw new Error('Pinterest origin must be the claimed production domain');
  const start = new Date(config.startsAt), cutoff = new Date(config.archiveCutoff);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(cutoff.getTime()) || start < cutoff) throw new Error('Invalid Pinterest launch dates');
  if (JSON.stringify(Object.keys(config.categories).sort()) !== JSON.stringify(['esprit','science','societe'])) throw new Error('Expected the three French categories');
  for (const category of Object.values(config.categories)) {
    if (!category.label || !category.board || !/^#[0-9a-f]{6}$/i.test(category.accent)) throw new Error('Invalid category metadata');
  }
  if (!Number.isInteger(config.feedWindowDays) || config.feedWindowDays < 7 || config.feedWindowDays > 28) throw new Error('Feed window must be 7–28 days');
  if (JSON.stringify(config.archiveWeekdaysUtc) !== '[2,5,0]' || config.archiveHourUtc !== 14) throw new Error('Archive cadence must be Tue/Fri/Sun at 14:00 UTC');
}

/** Freeze this once in archive.json; additions/reordering must be reviewed. */
export function createArchiveCalendar(posts, config) {
  validateConfig(config);
  const cutoff = new Date(config.archiveCutoff);
  const categories = Object.keys(config.categories);
  const preferred = { science: 'echecs-et-memoire', esprit: 'psychologie-du-joueur-d-echecs', societe: 'echecs-et-argent' };
  const queues = Object.fromEntries(categories.map(category => [category, posts
    .filter(p => p.category === category && isEligible(p, config, cutoff) && new Date(p.publishedAt) < cutoff)
    .sort((a,b) => Number(b.slug === preferred[category]) - Number(a.slug === preferred[category]) ||
      (a.featured ? a.featuredRank ?? 99 : 999) - (b.featured ? b.featuredRank ?? 99 : 999) ||
      new Date(b.publishedAt) - new Date(a.publishedAt) || a.slug.localeCompare(b.slug))]));
  const archive = [];
  const day = new Date(config.startsAt);
  day.setUTCHours(config.archiveHourUtc, 0, 0, 0);
  while (Object.values(queues).some(queue => queue.length)) {
    const slot = config.archiveWeekdaysUtc.indexOf(day.getUTCDay());
    if (slot >= 0 && day >= new Date(config.startsAt)) {
      const category = [...categories.slice(slot), ...categories.slice(0,slot)].find(cat => queues[cat].length);
      const post = queues[category].shift();
      archive.push({ slug: post.slug, category, releaseAt: day.toISOString() });
    }
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return archive;
}

export function validateArchive(archive, posts, config) {
  validateConfig(config);
  const bySlug = new Map(posts.map(post => [post.slug, post]));
  if (bySlug.size !== posts.length) throw new Error('Duplicate article slug');
  const seen = new Set(), dates = new Set();
  for (const entry of archive) {
    const post = bySlug.get(entry.slug), release = new Date(entry.releaseAt);
    if (!post || post.category !== entry.category || !Object.hasOwn(config.categories, entry.category)) throw new Error(`Unknown/moved archive entry: ${entry.slug}`);
    if (seen.has(entry.slug) || dates.has(entry.releaseAt)) throw new Error('Duplicate archive article or slot');
    if (!Number.isFinite(release.getTime()) || release < new Date(config.startsAt) || !config.archiveWeekdaysUtc.includes(release.getUTCDay()) ||
        release.getUTCHours() !== config.archiveHourUtc || release.getUTCMinutes() || release.getUTCSeconds() || release.getUTCMilliseconds() ||
        new Date(post.publishedAt) >= new Date(config.archiveCutoff) || release < new Date(post.publishedAt)) throw new Error(`Invalid archive slot: ${entry.slug}`);
    seen.add(entry.slug); dates.add(entry.releaseAt);
  }
}

/** Exposure to RSS is not a receipt of publication on Pinterest. */
export function selectFeedItems(posts, archive, config, now = new Date()) {
  validateArchive(archive, posts, config);
  if (!Number.isFinite(now.getTime())) throw new Error('Invalid build date');
  const releases = new Map(archive.map(entry => [entry.slug, entry.releaseAt]));
  const start = new Date(config.startsAt).getTime();
  const lower = now.getTime() - config.feedWindowDays * DAY;
  return posts.filter(post => isEligible(post, config, now)).flatMap(post => {
    const isArchive = new Date(post.publishedAt) < new Date(config.archiveCutoff);
    const releaseAt = isArchive ? releases.get(post.slug) : new Date(Math.max(start, new Date(post.publishedAt).getTime())).toISOString();
    if (!releaseAt) return [];
    const release = new Date(releaseAt).getTime();
    return release >= start && release <= now.getTime() && release > lower ? [{...post, releaseAt, kind: isArchive ? 'archive' : 'new'}] : [];
  }).sort((a,b) => a.releaseAt.localeCompare(b.releaseAt) || a.slug.localeCompare(b.slug));
}
