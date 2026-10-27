import path from 'node:path';
import { createRequire } from 'node:module';
import sharp from 'sharp';
import { pinTitle } from './feed.mjs';

const require = createRequire(import.meta.url);
const fontfile = require.resolve('@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2');
const sansFile = require.resolve('@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2');
const PAPER = '#faf8ef';
const INK = '#1c1a16';
const escape = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');

export function localHeroPath(publicRoot, post) {
  const src = post.heroImage?.src;
  if (typeof src !== 'string' || !src.startsWith('/images/') || /[?#\\]/.test(src)) throw new Error(`Missing/local image required: ${post.slug}`);
  const root = path.resolve(publicRoot);
  const file = path.resolve(root, `.${src}`);
  if (!file.startsWith(root + path.sep)) throw new Error(`Image outside public/: ${post.slug}`);
  if (post.heroImage.sourceUrl && (!post.heroImage.credit || !post.heroImage.license)) throw new Error(`Photo credit and licence required: ${post.slug}`);
  return file;
}

async function textLayer(text, {width, height, family = 'Fraunces Bold', color = INK, small = false}) {
  return sharp({text: {
    text: `<span foreground="${color}">${escape(text)}</span>`,
    font: family, fontfile: small ? sansFile : fontfile,
    width, height, rgba: true, wrap: 'word',
  }}).png().toBuffer();
}

/** Compose a separate card; never crop, overwrite or add a second watermark to the source. */
export async function renderVisual(post, category, publicRoot) {
  const heroPath = localHeroPath(publicRoot, post);
  const hero = await sharp(heroPath).rotate().resize(1000, 667, {fit:'contain', background:PAPER}).png().toBuffer();
  const layers = [
    {input:Buffer.from(`<svg width="1000" height="1500"><rect width="1000" height="16" fill="${category.accent}"/><rect x="80" y="1280" width="840" height="3" fill="${category.accent}"/></svg>`),left:0,top:0},
    {input:await textLayer(`${category.label.toLocaleUpperCase('fr')} · ÉCHECS`,{width:840,height:38,small:true,family:'Outfit SemiBold',color:INK}),left:80,top:76},
    {input:await textLayer(pinTitle(post),{width:840,height:340}),left:80,top:168},
    {input:hero,left:0,top:540},
    {input:await textLayer('BLOG D’UN GAUCHER',{width:680,height:40,small:true,family:'Outfit SemiBold'}),left:80,top:1320},
    {input:await textLayer('blogdungaucher.com',{width:470,height:29,small:true,family:'Outfit'}),left:80,top:1392},
  ];
  if (post.heroImage.sourceUrl) {
    const credit = `${post.heroImage.credit} · ${post.heroImage.license}`;
    layers.push({input:await textLayer(credit,{width:840,height:48,small:true,family:'Outfit'}),left:80,top:1220});
  }
  return sharp({create:{width:1000,height:1500,channels:3,background:PAPER}}).composite(layers).jpeg({quality:88,mozjpeg:true}).toBuffer();
}
