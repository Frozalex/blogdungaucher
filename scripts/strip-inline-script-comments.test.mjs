import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { load } from "cheerio";

const exec = promisify(execFile);
const script = fileURLToPath(new URL("./strip-inline-script-comments.mjs", import.meta.url));

async function fixture(t, files) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gaucher-comments-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    await fs.mkdir(path.dirname(path.join(dir, name)), { recursive: true });
    await fs.writeFile(path.join(dir, name), content);
  }
  return {
    run: () => exec(process.execPath, [script, dir]),
    read: name => fs.readFile(path.join(dir, name), "utf8"),
  };
}

test("removes working comments without changing strings, regexes or templates", async t => {
  const body = String.raw`
    // Note de développement
    const url = "https://example.com/a//b";
    const pattern = /https?:\/\//;
    const template = \`texte /* conservé */ // conservé\`;
    globalThis.result = [url, pattern.test(url), template]; /* à retirer */
  `.replaceAll("\\`", "`");
  const f = await fixture(t, { "index.html": `<script>${body}</script>` });
  await f.run();
  const html = await f.read("index.html");
  assert.doesNotMatch(html, /Note de développement|à retirer/);
  const cleaned = load(html)("script").text();
  const before = {}, after = {};
  runInNewContext(body, before);
  runInNewContext(cleaned, after);
  assert.equal(JSON.stringify(after.result), JSON.stringify(before.result));
});

test("preserves JSON-LD, import maps and external scripts byte for byte", async t => {
  const html = '<script type=application/ld+json>{"url":"https://example.com/","text":"/* source */"}</script>' +
    '<script type="importmap">{"imports":{"x":"https://example.com/x.js"}}</script>' +
    '<script src="/external.js">/* repli externe */</script>';
  const f = await fixture(t, { "index.html": html });
  await f.run();
  assert.equal(await f.read("index.html"), html);
});

test("reads exact attributes, including unquoted types and quoted greater-than signs", async t => {
  const open = '<script data-src="example" data-label="a > b" type=module>';
  const f = await fixture(t, { "index.html": `${open}/* note */ globalThis.ok = true;</script>` });
  await f.run();
  const html = await f.read("index.html");
  assert.ok(html.startsWith(open));
  assert.doesNotMatch(html, /\/\* note \*\//);
  assert.match(html, /globalThis.ok/);
});

test("leaves literal script examples, page markup and CSS unchanged", async t => {
  const examples = '<p>Un <em>exemple</em> &amp; son code.</p>' +
    '<pre><code>&lt;script&gt;/* exemple */&lt;/script&gt;</code></pre>' +
    '<textarea><script>/* code à afficher */ const x = 1;</script></textarea>' +
    '<!-- <script>/* exemple masqué */ const y = 2;</script> -->' +
    '<style>/* feuille de style */ p { color: green }</style>';
  const f = await fixture(t, { "index.html": `${examples}<script>/* note JS */ let z = 3;</script>` });
  await f.run();
  const html = await f.read("index.html");
  assert.ok(html.startsWith(examples));
  assert.doesNotMatch(html, /note JS/);
});

test("cleans comments even when Unicode escaping makes the script longer", async t => {
  const f = await fixture(t, { "index.html": "<script>let é=1/**/</script>" });
  await f.run();
  assert.doesNotMatch(await f.read("index.html"), /\/\*\*\//);
});

test("keeps license notices and excludes third-party JavaScript", async t => {
  const vendor = "/*! Copyright Third Party */\n// upstream note\nglobalThis.vendor = true;";
  const own = "/*! @license MIT */\n// working note\nglobalThis.own = true;";
  const f = await fixture(t, {
    "index.html": `<script>${own}</script>`,
    "sw.js": own,
    "i18n-dict.js": own,
    "stockfish/stockfish.js": vendor,
  });
  await f.run();
  for (const name of ["index.html", "sw.js", "i18n-dict.js"]) {
    const output = await f.read(name);
    assert.match(output, /@license MIT/);
    assert.doesNotMatch(output, /working note/);
  }
  assert.equal(await f.read("stockfish/stockfish.js"), vendor);
});

test("leaves invalid JavaScript intact", async t => {
  const html = "<script>/* note */ const = ;</script>";
  const f = await fixture(t, { "index.html": html });
  await f.run();
  assert.equal(await f.read("index.html"), html);
});

test("does not change the output on a second pass", async t => {
  const f = await fixture(t, {
    "fr/index.html": '<script>/* note */ globalThis.url = "https://example.com";</script>',
    "sw.js": '// note\nconst cacheName = "https://example.com";',
  });
  await f.run();
  const before = await Promise.all([f.read("fr/index.html"), f.read("sw.js")]);
  await f.run();
  assert.deepEqual(await Promise.all([f.read("fr/index.html"), f.read("sw.js")]), before);
});
