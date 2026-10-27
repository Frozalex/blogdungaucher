import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from '@astrojs/markdown-remark';

export function readPosts(directory) {
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(path.join(dir, entry.name)) : entry.name.endsWith('.md') ? [path.join(dir, entry.name)] : []);
  return walk(directory).map(file => {
    const data = parseFrontmatter(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')).frontmatter;
    for (const field of ['draft', 'noindex']) if (data[field] !== undefined && typeof data[field] !== 'boolean') throw new Error(`Invalid ${field}: ${file}`);
    const slug = path.basename(file, '.md');
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Invalid article slug: ${slug}`);
    const publishedAt = new Date(data.publishDate).toISOString();
    return { ...data, slug, publishedAt };
  });
}

export function isEligible(post, config, now) {
  return Object.hasOwn(config.categories, post.category) && post.draft !== true && post.noindex !== true &&
    new Date(post.publishedAt).getTime() <= now.getTime();
}
