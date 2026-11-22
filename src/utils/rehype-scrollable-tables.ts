import { SKIP, visit } from "unist-util-visit";
import type { Root } from "hast";

/** Garde les colonnes lisibles dans une zone défilante sur les écrans étroits. */
export function rehypeScrollableTables() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table" || !parent || index === undefined) return;
      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["table-scroll"] },
        children: [node],
      };
      return SKIP;
    });
  };
}
