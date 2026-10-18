import test from 'node:test';
import assert from 'node:assert/strict';
import { finalizeHtml } from './finalize-public-navigation.mjs';
const origin='https://blogdungaucher.com';
const pages=new Map([['/fr/blog/live/',{indexable:true}],['/en/blog/live/',{indexable:false}],['/nl/',{indexable:false}]]);
const scheduled=new Set(['/fr/blog/future/']);
const run=(html,p=pages)=>finalizeHtml(html,origin+'/fr/',p,scheduled).html;
test('scheduled links preserve the exact label and nested formatting',()=>{
 assert.equal(run('<p><a href="/fr/blog/future/?x=1#test">Un <em>article</em></a>.</p>'),'<p>Un <em>article</em>.</p>');
});
test('a published target restores the original link on the next build',()=>{
 const p=new Map(pages);p.set('/fr/blog/future/',{indexable:true});const html='<a href="/fr/blog/future/">Article</a>';assert.equal(run(html,p),html);
});
test('unknown broken links remain visible to the build checker',()=>{
 const html='<a href="/fr/blog/typo/">Article</a>';assert.equal(run(html),html);
});
test('external links, scripts and unrelated markup are preserved byte for byte',()=>{
 const html='<script>const x="<a href=/fr/blog/future/>";</script><a href="https://example.com/fr/blog/future/">Example</a>';assert.equal(run(html),html);
});
test('hreflang excludes noindex, missing pages and redirects',()=>{
 const html='<link rel="alternate" hreflang="fr" href="'+origin+'/fr/blog/live/"><link rel="alternate" hreflang="en" href="'+origin+'/en/blog/live/"><link rel="alternate" hreflang="nl" href="'+origin+'/nl/"><link rel="alternate" hreflang="pt-BR" href="'+origin+'/missing/">';assert.equal(run(html),html.slice(0,html.indexOf('<link',1)));
});
test('noindex source pages do not emit hreflang',()=>{
 const html='<meta name="robots" content="noindex, follow"><link rel="alternate" hreflang="fr" href="'+origin+'/fr/blog/live/">';assert.equal(run(html),'<meta name="robots" content="noindex, follow">');
});
test('prelaunch NL blog navigation uses the available French blog',()=>{
 assert.equal(run('<a class="nav" href="/nl/blog/">Blog</a>'),'<a class="nav" href="/fr/blog/">Blog</a>');
 const p=new Map(pages);p.set('/nl/blog/',{indexable:true});assert.equal(run('<a href="/nl/blog/">Blog</a>',p),'<a href="/nl/blog/">Blog</a>');
});
test('a second pass is idempotent',()=>{
 const html='<p><a href="/fr/blog/future/">Future</a></p>';assert.equal(run(run(html)),run(html));
});
