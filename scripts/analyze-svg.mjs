import { readFileSync } from "fs";

const svg = readFileSync("./public/images/logo.svg", "utf-8");
const re = /d="([^"]*)"/g;
let match;
const sizes = [];
while ((match = re.exec(svg)) !== null) {
  sizes.push(match[1].length);
}
sizes.sort((a, b) => a - b);

const counts = { tiny: 0, small: 0, medium: 0, large: 0 };
for (const s of sizes) {
  if (s < 60) counts.tiny++;
  else if (s < 200) counts.small++;
  else if (s < 800) counts.medium++;
  else counts.large++;
}
console.log("Répartition des paths par longueur de 'd':", counts);
console.log("Total paths:", sizes.length);
console.log("10 premiers:", sizes.slice(0, 10));
console.log("10 derniers:", sizes.slice(-10));
