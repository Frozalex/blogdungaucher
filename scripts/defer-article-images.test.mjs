import test from "node:test";
import assert from "node:assert/strict";
import { deferArticleImages } from "./defer-article-images.mjs";

test("defers reading illustrations while preserving source, dimensions and credit", () => {
  const image = '<img src="/schema.svg" alt="Un repère > 1" width="900" height="600">';
  const html = `<div class="article-body"><figure>${image}<figcaption>Crédit : auteur <a href="https://example.com">source</a>.</figcaption></figure></div>`;
  const result = deferArticleImages(html);
  assert.equal(result.deferred, 1);
  assert.equal(result.html, html.replace('height="600">', 'height="600" loading="lazy" decoding="async">'));
});

test("leaves covers and images outside the reading column unchanged", () => {
  const image = '<img src="/cover.webp" width="1200" height="800" fetchpriority="high">';
  const html = `<header>${image}</header><div class="article-body"><p>Texte.</p></div><aside>${image}</aside>`;
  assert.equal(deferArticleImages(html).html, html);
});

test("honors explicit loading, decoding and high-priority hints", () => {
  const html = '<div class="article-body"><img src="a.svg" width="100" height="80" loading="eager" decoding="sync">' +
    '<img src="b.svg" width="100" height="80" fetchpriority="high"></div>';
  const result = deferArticleImages(html);
  assert.equal(result.deferred, 0);
  assert.equal(result.html, html.replace('fetchpriority="high">', 'fetchpriority="high" decoding="async">'));
});

test("does not defer an image without reserved dimensions", () => {
  const html = '<div class="article-body"><img src="https://example.com/photo.jpg"></div>';
  assert.equal(deferArticleImages(html).html, html);
});

test("preserves literal HTML in scripts and text areas", () => {
  const literal = '<img src="example.svg" width="100" height="80">';
  const html = `<div class="article-body"><script>const example = ${JSON.stringify(literal)};</script><textarea>${literal}</textarea></div>`;
  assert.equal(deferArticleImages(html).html, html);
});

test("a second pass preserves the exact output", () => {
  const html = '<div class="article-body"><img src="schema.svg" width=100 height=80 /></div>';
  const first = deferArticleImages(html);
  assert.equal(first.deferred, 1);
  assert.equal(deferArticleImages(first.html).html, first.html);
  assert.equal(deferArticleImages(first.html).deferred, 0);
});
