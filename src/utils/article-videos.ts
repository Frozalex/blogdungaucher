import fs from "node:fs";
import path from "node:path";

export interface ArticleSummaryVideo {
  slug: string;
  title: string;
  video: string;
  poster: string;
  duration: number;
  scenes: Array<{ heading: string; text: string }>;
}

let summaries: Map<string, ArticleSummaryVideo> | undefined;

/** Only completed exports appear in this manifest; the build validates their hashes. */
export function getArticleSummaryVideo(slug: string): ArticleSummaryVideo | undefined {
  if (!summaries) {
    const file = path.join(process.cwd(), "public/article-videos/manifest.json");
    const manifest = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file, "utf8"))
      : { entries: [] };
    summaries = new Map<string, ArticleSummaryVideo>(manifest.entries.map((entry: ArticleSummaryVideo): [string, ArticleSummaryVideo] => [entry.slug, entry]));
  }
  return summaries.get(slug);
}
