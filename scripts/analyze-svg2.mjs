import { readFileSync } from "fs";

const svg = readFileSync("./public/images/logo.svg", "utf-8");

// Extraire tous les paths avec leur fill et longueur
const re = /<path[^>]*fill="([^"]*)"[^>]*d="([^"]*)"/g;
let match;
const paths = [];
while ((match = re.exec(svg)) !== null) {
  paths.push({ fill: match[1], dLen: match[2].length, d: match[2].slice(0, 80) });
}

// Afficher les paths "small" (60-200) pour voir si ce sont des détails ou du bruit
console.log("=== Exemples de paths 'small' (60-200 chars) ===");
paths.filter(p => p.dLen >= 60 && p.dLen < 200).slice(0, 8).forEach(p => {
  console.log(`fill=${p.fill} len=${p.dLen}: ${p.d}...`);
});

console.log("\n=== Paths 'medium' (200-800) ===");
paths.filter(p => p.dLen >= 200 && p.dLen < 800).slice(0, 5).forEach(p => {
  console.log(`fill=${p.fill} len=${p.dLen}: ${p.d}...`);
});

console.log("\n=== Paths 'large' (800+) ===");
paths.filter(p => p.dLen >= 800).forEach(p => {
  console.log(`fill=${p.fill} len=${p.dLen}`);
});
