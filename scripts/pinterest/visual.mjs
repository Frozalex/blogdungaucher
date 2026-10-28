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
  if (post.pinId) return renderAngleVisual(post,category,publicRoot);
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

/** Six editorial compositions reuse the whole credited cover with a distinct passage. */
async function renderAngleVisual(post, category, publicRoot) {
  const settings = {
    focus:       {hero:[0,510,1000,667], title:[76,164,848,280], band:1280},
    question:    {hero:[60,110,880,587], title:[76,780,848,330], band:730},
    dossier:     {hero:[120,530,760,507], title:[76,170,848,290], band:1130},
    repere:      {hero:[0,630,1000,667], title:[76,180,848,350], band:120},
    lecture:     {hero:[0,140,1000,667], title:[76,865,848,330], band:820},
    perspective: {hero:[100,590,800,534], title:[76,210,848,300], band:145},
  }[post.pinLayout];
  if (!settings) throw new Error(`Unknown visual layout: ${post.pinLayout}`);
  const [x,y,w,h] = settings.hero, [tx,ty,tw,th] = settings.title;
  const hero = await sharp(localHeroPath(publicRoot,post)).rotate().resize(w,h,{fit:'contain',background:PAPER}).png().toBuffer();
  const labels = {focus:'COMPRENDRE',question:'UNE QUESTION À EXPLORER',dossier:'DANS LE DOSSIER',repere:'UN REPÈRE POUR RÉFLÉCHIR',lecture:'LE TEMPS DE COMPRENDRE',perspective:'CHANGER DE PERSPECTIVE'};
  const shapes = `<svg width="1000" height="1500"><rect width="1000" height="18" fill="${category.accent}"/><rect x="0" y="${settings.band}" width="1000" height="12" fill="${category.accent}"/>${post.pinLayout==='dossier' ? `<rect x="60" y="490" width="880" height="590" rx="20" fill="${category.accent}"/>` : ''}${post.pinLayout==='perspective' ? `<circle cx="910" cy="210" r="42" fill="${category.accent}"/>` : ''}</svg>`;
  const layers = [
    {input:Buffer.from(shapes),left:0,top:0},
    {input:await textLayer(`${category.label.toLocaleUpperCase('fr')} · ${labels[post.pinLayout]}`,{width:848,height:32,small:true,family:'Outfit SemiBold'}),left:76,top:62},
    {input:hero,left:x,top:y},
    {input:await textLayer(pinTitle(post),{width:tw,height:th}),left:tx,top:ty},
    {input:await textLayer(post.articleTitle,{width:848,height:58,small:true,family:'Outfit'}),left:76,top:1322},
    {input:await textLayer('LIRE LE DOSSIER · blogdungaucher.com',{width:848,height:32,small:true,family:'Outfit SemiBold'}),left:76,top:1420},
  ];
  if (post.heroImage.sourceUrl) {
    layers.push({input:await textLayer(`${post.heroImage.credit} · ${post.heroImage.license}`,{width:w-40,height:34,small:true,family:'Outfit'}),left:x+20,top:y+h-36});
  }
  return sharp({create:{width:1000,height:1500,channels:3,background:PAPER}}).composite(layers).jpeg({quality:88,mozjpeg:true}).toBuffer();
}
