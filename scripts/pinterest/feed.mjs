export const escapeXml = value => String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'')
  .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
export const plain = value => String(value).replace(/<[^>]*>/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*_`]/g,'').replace(/\s+/g,' ').trim();

export function pinTitle(post) {
  const text = String(post.title).replace(/\s+/g,' ').trim();
  if (text.length <= 100) return text;
  return text.slice(0, 99).replace(/\s+\S*$/, '').trim() + '…';
}

export const imageName = post => post.pinId || post.slug;
export const pinGuid = (post, config) => post.pinId ? `urn:blogdungaucher:pinterest:${post.pinId}` : articleUrl(post,config,false);
export const pinImagePath = post => post.mediaFormat==='pdf' ? `/pinterest-media/covers/${imageName(post)}.jpg` : `/pinterest/images/${imageName(post)}.jpg`;

export function articleUrl(post, config, tracking = true) {
  const url = new URL(`/fr/blog/${post.slug}/`,config.origin);
  if (tracking) {
    if (post.mediaFormat==='pdf') url.pathname = `/pinterest-media/pdf/${imageName(post)}.pdf`;
    url.searchParams.set('utm_source','pinterest');
    url.searchParams.set('utm_medium','organic_social');
    url.searchParams.set('utm_campaign',`rss_${post.category}`);
    url.searchParams.set('utm_content',imageName(post));
    if (post.pinSource?.anchor && post.mediaFormat!=='pdf') url.hash = post.pinSource.anchor;
  }
  return url.href;
}
export function renderFeed(category, items, config, now) {
  const meta = config.categories[category];
  if (!meta || items.some(item => item.category !== category)) throw new Error("Mixed/unknown Pinterest category");
  if (items.some(item=>item.mediaFormat==='video')) throw new Error('Native video pins require Pinterest import, not the image RSS feed');
  const itemXml = items.map(post => {
    const title = pinTitle(post);
    const description = (post.mediaFormat==='pdf' ? 'Fiche PDF à télécharger. ' : '') + plain(post.seoDescription || post.excerpt);
    const credit = post.heroImage.sourceUrl ? ` Crédit : ${post.heroImage.credit} (${post.heroImage.license}). Source : ${post.heroImage.sourceUrl}` : '';
    const imageUrl = new URL(pinImagePath(post),config.origin).href;
    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(articleUrl(post,config))}</link>
      <guid isPermaLink="${post.pinId ? 'false' : 'true'}">${escapeXml(pinGuid(post,config))}</guid>
      <pubDate>${new Date(post.releaseAt).toUTCString()}</pubDate>
      <description>${escapeXml(description + credit)}</description>
      <media:content url="${escapeXml(imageUrl)}" type="image/jpeg" medium="image" width="1000" height="1500" />
    </item>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(meta.board)} · Blog d’un Gaucher</title>
    <link>${config.origin}/fr/${category}/</link>
    <atom:link href="${config.origin}/pinterest/${category}.xml" rel="self" type="application/rss+xml" />
    <description>Articles en français : ${escapeXml(meta.label)} et échecs.</description>
    <language>fr-FR</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
${itemXml}
  </channel>
</rss>
`;
}
