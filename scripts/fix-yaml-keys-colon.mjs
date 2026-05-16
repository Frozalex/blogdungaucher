import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const blogDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/content/blog");

for (const name of fs.readdirSync(blogDir)) {
  if (!name.endsWith(".md")) continue;
  const filePath = path.join(blogDir, name);
  const before = fs.readFileSync(filePath, "utf8");
  let after = before.replace(/^(\s*)([a-zA-Z][\w-]*) : /gm, "$1$2: ");
  after = after.replace(/- question : /g, "- question: ");
  after = after.replace(/^(\s+)answer : /gm, "$1answer: ");
  if (after !== before) {
    fs.writeFileSync(filePath, after, "utf8");
    console.log(name);
  }
}
