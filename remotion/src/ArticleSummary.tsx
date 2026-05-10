import type { DataRevealPayload, VideoPostProps } from "./types";
import { ArticleSummaryClassic } from "./ArticleSummaryClassic";
import { ArticleSummaryDataReveal } from "./ArticleSummaryDataReveal";

function isCompleteDataReveal(
  d: DataRevealPayload | null | undefined,
): d is DataRevealPayload {
  if (!d) return false;
  if (!d.vizTitle?.trim() || !d.highlight?.trim() || !d.source?.trim() || !d.takeaway?.trim())
    return false;
  return Array.isArray(d.bars) && d.bars.length > 0;
}

export function ArticleSummary(props: VideoPostProps) {
  if (
    props.summarySequence === "data-reveal" &&
    isCompleteDataReveal(props.dataReveal ?? null)
  ) {
    const dataReveal = props.dataReveal as DataRevealPayload;
    return <ArticleSummaryDataReveal {...props} dataReveal={dataReveal} />;
  }

  return <ArticleSummaryClassic {...props} />;
}
