/** Local files only. No API, credentials, contact list, campaign or sending code. */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderNewsletterLetter } from "./lib/newsletter-letter.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log("Usage : node scripts/preview-newsletter.mjs [lettre.json] [dossier-de-sortie]\nCrée uniquement lettre.html et lettre.txt. Aucun envoi.");
  process.exit(0);
}
if (args.length > 2 || args.some((arg) => arg.startsWith("--"))) throw new Error("Deux chemins au maximum ; aucun mode d’envoi disponible.");
const input = resolve(args[0] || resolve(root, "src/data/newsletter-example.json"));
const output = resolve(args[1] || resolve(root, "docs/refonte-2026-11-13/newsletter/preview"));
const [data, template] = await Promise.all([
  readFile(input, "utf8"), readFile(resolve(root, "emails/letter.html"), "utf8"),
]);
const rendered = renderNewsletterLetter(JSON.parse(data), template);
await mkdir(output, { recursive: true });
for (const [filename, content] of [["lettre.html", rendered.html], ["lettre.txt", rendered.text]]) {
  const destination = resolve(output, filename);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, content, { encoding: "utf8", flag: "wx" });
  console.log(destination);
}
console.log("Aperçu local créé. Aucun email envoyé. Utiliser un autre dossier pour préserver cet aperçu.");
