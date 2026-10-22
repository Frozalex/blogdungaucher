import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const layout = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
const scripts = [...layout.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const languageScript = scripts.find(code => code.includes("window.__applyLang = applyLang"));
const offlineScript = scripts.find(code => code.includes('navigator.serviceWorker.register("/sw.js")'));

function languagePage(lang, readyState = "loading") {
  const events = new Map();
  const label = { textContent: "Server translation", getAttribute: () => "nav.siteName" };
  const document = {
    readyState,
    documentElement: { lang, dataset: {} },
    querySelectorAll: selector => selector === "[data-t]" ? [label] : [],
    addEventListener: (name, callback) => events.set(name, callback),
  };
  const window = { matchMedia: () => ({ matches: false }) };
  const context = { window, document, location: { pathname: `/${lang}/` }, localStorage: { getItem: () => "dark" }, Intl };
  return { window, document, events, label, context };
}

test("deferred dictionary keeps the English server text until it is available", () => {
  const page = languagePage("en");
  runInNewContext(languageScript, page.context);
  assert.equal(page.label.textContent, "Server translation");
  assert.equal(page.document.documentElement.dataset.theme, "dark");
  page.window.__I18N_DICT__ = { en: { "nav.siteName": "English label" }, fr: {} };
  page.events.get("DOMContentLoaded")();
  assert.equal(page.label.textContent, "English label");
  assert.equal(page.window.__i18n, page.window.__I18N_DICT__);
});

test("a client navigation can use a dictionary that has already loaded", () => {
  const page = languagePage("en", "complete");
  page.window.__I18N_DICT__ = { en: { "nav.siteName": "English label" }, fr: {} };
  runInNewContext(languageScript, page.context);
  assert.equal(page.label.textContent, "English label");
  assert.equal(page.window.__lang, "en");
});

for (const lang of ["fr", "pt-br", "nl"]) {
  test(`the ${lang} server translation is preserved`, () => {
    const page = languagePage(lang);
    runInNewContext(languageScript, page.context);
    page.window.__I18N_DICT__ = { fr: { "nav.siteName": "French runtime label" }, en: {} };
    page.events.get("DOMContentLoaded")();
    assert.equal(page.label.textContent, "Server translation");
    assert.equal(page.document.documentElement.lang, lang);
    assert.equal(page.window.__lang, lang);
  });
}

test("offline precaching waits for page load and an idle opportunity", () => {
  const events = new Map();
  const idle = [];
  const registrations = [];
  const window = {
    addEventListener: (name, callback) => events.set(name, callback),
    requestIdleCallback: callback => idle.push(callback),
  };
  const document = { readyState: "loading", addEventListener() {} };
  const navigator = { serviceWorker: { register: url => { registrations.push(url); return Promise.resolve(); } } };
  runInNewContext(offlineScript, { window, document, navigator });
  assert.deepEqual(registrations, []);
  events.get("load")();
  assert.deepEqual(registrations, []);
  idle[0]();
  assert.deepEqual(registrations, ["/sw.js"]);
});

test("the Python module initializes even when loaded after astro:page-load", () => {
  const code = readFileSync(new URL("../src/scripts/pyodide-trace.js", import.meta.url), "utf8")
    .replace(/export\s*\{\s*\};?\s*$/, "");
  const events = new Map();
  let scans = 0;
  const document = {
    querySelectorAll: () => { scans++; return []; },
    addEventListener: (name, callback) => events.set(name, callback),
  };
  runInNewContext(code, { document, window: {} });
  assert.equal(scans, 1);
  events.get("astro:page-load")();
  assert.equal(scans, 2);
});
