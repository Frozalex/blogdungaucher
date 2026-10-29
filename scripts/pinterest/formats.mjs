import { imageName } from './feed.mjs';

export function validateFormats(formats, archive, variants) {
  const ids = [...archive.map(p=>p.slug),...variants.map(p=>p.pinId)];
  if (Object.keys(formats).length !== 730 || ids.some(id=>!Object.hasOwn(formats,id))) throw new Error('Expected a format for each of the 730 campaign pins');
  const counts = {image:0,video:0,pdf:0};
  for (const type of Object.values(formats)) {
    if (!Object.hasOwn(counts,type)) throw new Error('Unknown campaign format');
    counts[type]++;
  }
  if (counts.image!==244 || counts.video!==243 || counts.pdf!==243) throw new Error('Expected 244 images, 243 videos, 243 PDFs');
  if (archive.filter(pin=>pin.initial).some(pin=>formats[pin.slug]!=='image')) throw new Error('Already exposed initial pins must stay images');
  return counts;
}

export const withFormats = (items,formats) => items.map(item=>({...item,mediaFormat:formats[imageName(item)]||'image'}));
export const rssOnly = items => items.filter(item=>item.mediaFormat!=='video');
