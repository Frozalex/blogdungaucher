import fs from "node:fs";
import path from "node:path";

/**
 * Indique si une ressource sous `/…` correspond à un fichier réel dans `public/`
 * (taille > 0). Les URLs absolues http(s) sont considérées disponibles (hébergement externe).
 */
export function isPublicAssetAvailable(src: string): boolean {
  const s = src.trim();
  if (!s) return false;
  if (/^https?:\/\//i.test(s)) return true;
  if (!s.startsWith("/")) return false;
  const rel = s.replace(/^\/+/, "");
  const abs = path.join(process.cwd(), "public", rel);
  try {
    return fs.existsSync(abs) && fs.statSync(abs).size > 0;
  } catch {
    return false;
  }
}
