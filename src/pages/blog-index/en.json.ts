import type { APIRoute } from "astro";

import { buildBlogIndexResponse } from "../../utils/blog-index";

// Nom de fichier statique plutôt qu'un paramètre `[lang]` : avec
// `trailingSlash: "always"`, une route dynamique à extension n'est servie qu'avec
// un slash final (/blog-index/fr.json/), ce que nginx ne reproduirait pas en prod.
export const GET: APIRoute = () => buildBlogIndexResponse("en");
