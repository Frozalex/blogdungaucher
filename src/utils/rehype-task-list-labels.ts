import { visit } from "unist-util-visit";
import type { Element, Root, RootContent } from "hast";

function itemText(node: RootContent): string {
  if (node.type === "text") return node.value;
  if (node.type !== "element" || ["ul", "ol", "input"].includes(node.tagName)) return "";
  return node.children.map(itemText).join("");
}

/** Donne aux cases des listes Markdown le nom de leur consigne. */
export function rehypeTaskListLabels() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "li") return;
      const label = node.children.map(itemText).join("").replace(/\s+/g, " ").trim();
      if (!label) return;
      for (const child of node.children) {
        const candidates = child.type === "element" && child.tagName === "p" ? child.children : [child];
        for (const input of candidates) {
          if (input.type === "element" && input.tagName === "input" && input.properties.type === "checkbox"
            && !input.properties.ariaLabel && !input.properties.ariaLabelledBy) {
            input.properties.ariaLabel = label;
          }
        }
      }
    });
  };
}
