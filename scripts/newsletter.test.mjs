import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Chess } from "chess.js";
import { build } from "esbuild";
import { renderNewsletterLetter, validateNewsletterLetter } from "./lib/newsletter-letter.mjs";

const example = JSON.parse(await readFile(new URL("../src/data/newsletter-example.json", import.meta.url), "utf8"));
const template = await readFile(new URL("../emails/letter.html", import.meta.url), "utf8");
const bundled = await build({ entryPoints: ["src/scripts/newsletter-subscription.ts"], bundle: true, platform: "node", format: "esm", write: false });
const { requestNewsletterSubscription } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);

test("la position exemple donne mat et le contre-exemple dispose de Kh7", () => {
  const original = new Chess(example.position.fen);
  original.move(example.position.solutionSan[0], { strict: true });
  assert.equal(original.isCheckmate(), true);
  const comparison = new Chess(example.position.comparisonFen);
  comparison.move(example.position.comparisonSan[0], { strict: true });
  assert.equal(comparison.isCheckmate(), false);
  comparison.move(example.position.comparisonSan[1], { strict: true });
  assert.equal(comparison.isCheck(), false);
});

test("une lettre exige trois rubriques rédigées et une variante légale", () => {
  assert.equal(validateNewsletterLetter(example), example);
  const missing = structuredClone(example);
  delete missing.idea;
  assert.throws(() => validateNewsletterLetter(missing), /Rubrique manquante/);
  const illegal = structuredClone(example);
  illegal.position.solutionSan = ["Rf9#"];
  assert.throws(() => validateNewsletterLetter(illegal));
  const url = structuredClone(example);
  url.reading.url = "javascript:alert(1)";
  assert.throws(() => validateNewsletterLetter(url), /HTTPS/);
});

test("le rendu HTML échappe le contenu, conserve le désabonnement et produit les trois rubriques", () => {
  const authored = structuredClone(example);
  authored.subject = '<script>danger</script> & "test"';
  const output = renderNewsletterLetter(authored, template);
  assert.ok(!output.html.includes("<script>"));
  assert.ok(output.html.includes("&lt;script&gt;danger&lt;/script&gt;"));
  for (const heading of ["UNE IDÉE EXPLIQUÉE", "UNE POSITION COMMENTÉE", "UNE LECTURE RECOMMANDÉE"]) {
    assert.ok(output.html.includes(heading));
    assert.ok(output.text.includes(heading));
  }
  assert.ok(output.html.includes("{{ unsubscribe }}"));
  assert.ok(output.text.includes("{{ unsubscribe }}"));
  assert.ok(!/\{\{[A-Z_]+\}\}/.test(output.html));
});

const subscription = { email: "test@example.invalid", website: "", elapsedMs: 4000 };
test("201 et 204 déclenchent un seul événement après acceptation, sans adresse ni texte libre", async () => {
  for (const status of [201, 204]) {
    const sequence = [];
    await requestNewsletterSubscription("https://example.invalid/subscribe", subscription, "article-science", {
      send: async (_url, init) => { assert.deepEqual(JSON.parse(init.body), subscription); sequence.push("response"); return new Response(null, { status }); },
      track: (event, data) => { sequence.push("event"); assert.equal(event, "newsletter_confirmed"); assert.deepEqual(data, { placement: "article-science" }); },
    });
    assert.deepEqual(sequence, ["response", "event"]);
  }
});

test("les erreurs HTTP et réseau ne produisent aucun événement", async () => {
  let events = 0;
  for (const status of [400, 429, 500]) {
    await assert.rejects(requestNewsletterSubscription("https://example.invalid/subscribe", subscription, "footer", {
      send: async () => new Response(null, { status }), track: () => events++,
    }));
  }
  await assert.rejects(requestNewsletterSubscription("https://example.invalid/subscribe", subscription, "footer", {
    send: async () => { throw new Error("offline"); }, track: () => events++,
  }));
  assert.equal(events, 0);
});

test("un placement inconnu ne peut pas exporter du texte utilisateur", async () => {
  await requestNewsletterSubscription("https://example.invalid/subscribe", subscription, "test@example.invalid", {
    send: async () => new Response(null, { status: 204 }),
    track: (_event, data) => assert.deepEqual(data, { placement: "article" }),
  });
});
