/**
 * Orchestrateur de build « propre » :
 *   1. Lance `npm run build` (build initial)
 *   2. Retire les tirets cadratin du contenu source
 *   3. Si au moins un tiret a été retiré, relance `npm run build` pour
 *      que la sortie dist/ reflète le contenu nettoyé.
 *
 * Pourquoi cet ordre :
 *   - Le premier build sert de garde-fou : si la base ne compile pas, on
 *     s'arrête avant de modifier du contenu.
 *   - Si aucun tiret n'est trouvé, on saute le rebuild (économie de temps).
 *
 * Usage :
 *   node scripts/build-clean.mjs           → build → strip → rebuild
 *   node scripts/build-clean.mjs --no-pre  → strip → build (skip premier build)
 *
 * Hook npm associé : `npm run build:clean` (voir package.json).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const skipPre = process.argv.includes("--no-pre");

/** Exécute une commande et propage le code de sortie en cas d'échec.
 *  shell:true sous Windows car npm est résolu par .cmd, pas par binaire direct.
 *  La DEP0190 warning est sans risque ici : on n'injecte aucun argument utilisateur. */
function runOrDie(cmd, args, label) {
  console.log(`\n▸ ${label} : ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (r.status !== 0) {
    console.error(`\n✗ Échec de "${label}" (code ${r.status}). On s'arrête.`);
    process.exit(r.status ?? 1);
  }
}

const NPM_BIN = "npm";

// ─── Étape 1. Build initial ──────────────────────────────────────────
if (!skipPre) {
  runOrDie(NPM_BIN, ["run", "build"], "Build initial");
} else {
  console.log("▸ Build initial sauté (--no-pre)");
}

// ─── Étape 2. Strip em-dash ──────────────────────────────────────────
console.log("\n▸ Nettoyage des tirets cadratin");
const stripRes = spawnSync(
  "node",
  ["scripts/strip-em-dash.mjs"],
  {
    cwd: root,
    stdio: ["inherit", "pipe", "inherit"],
    env: { ...process.env, STRIP_EM_DASH_OUTPUT: "json" },
  },
);

if (stripRes.status !== 0) {
  console.error("\n✗ Échec du script strip-em-dash. On s'arrête.");
  process.exit(stripRes.status ?? 1);
}

// Le script écrit son rapport texte sur stdout, puis une dernière ligne JSON.
const stdout = stripRes.stdout?.toString() ?? "";
process.stdout.write(stdout.split("\n").slice(0, -2).join("\n") + "\n");
let totalChanged = 0;
try {
  const lastJsonLine = stdout.trim().split("\n").pop();
  const parsed = JSON.parse(lastJsonLine);
  totalChanged = parsed.totalChanged ?? 0;
} catch {
  console.warn("⚠ Impossible de lire le résumé JSON du strip — on rebuild par sécurité.");
  totalChanged = 1;
}

// ─── Étape 3. Rebuild (seulement si nécessaire) ──────────────────────
if (totalChanged > 0) {
  console.log(`\n▸ ${totalChanged} tirets retirés → rebuild pour synchroniser dist/`);
  runOrDie(NPM_BIN, ["run", "build"], "Rebuild après nettoyage");
} else {
  console.log("\n✓ Aucun tiret cadratin trouvé : rebuild inutile, on garde dist/ tel quel.");
}

console.log("\n✓ build-clean terminé.");
