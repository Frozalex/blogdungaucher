import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useMemo } from "react";

import { allocateBlockFrames } from "./utils/allocate-frames";
import { padTakeaways } from "./utils/text";
import { theme } from "./theme";
import type { VideoPostProps } from "./types";

const LABEL = "En résumé";

export function ArticleSummaryClassic(props: VideoPostProps) {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const isPortrait = height > width;

  const points = padTakeaways(props.keyTakeaways, props.excerpt);

  const blocksMeta = useMemo(() => {
    const headerFrames = Math.round(1.4 * fps);
    const tailFrames = Math.round(0.9 * fps);
    const usable = Math.max(
      durationInFrames - headerFrames - tailFrames,
      fps * 5,
    );
    const durations = allocateBlockFrames(points, usable, fps);
    let cursor = headerFrames;
    return points.map((body, index) => {
      const duration = durations[index] ?? Math.round(3 * fps);
      const start = cursor;
      cursor += duration;
      return { title: `Point clé ${index + 1}`, body, start, duration };
    });
  }, [points, durationInFrames, fps]);

  let activeIndex = -1;
  for (let i = 0; i < blocksMeta.length; i++) {
    const b = blocksMeta[i];
    if (frame >= b.start && frame < b.start + b.duration) {
      activeIndex = i;
      break;
    }
  }
  const firstBlockStart = blocksMeta[0]?.start ?? Math.round(1.4 * fps);
  if (activeIndex < 0 && frame >= firstBlockStart && blocksMeta.length > 0) {
    activeIndex = blocksMeta.length - 1;
  }

  const headerOp = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  const cardLocal =
    activeIndex >= 0 ? Math.max(0, frame - blocksMeta[activeIndex].start) : 0;
  const cardOp = spring({
    frame: cardLocal,
    fps,
    config: { damping: 22, stiffness: 115 },
  });
  const lift = interpolate(cardOp, [0, 1], [14, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${theme.bg} 0%, ${props.accentColor}14 55%, ${theme.bgWarm} 100%)`,
        fontFamily: theme.fontBody,
        color: theme.textMain,
      }}
    >
      <AbsoluteFill
        style={{
          padding: isPortrait ? 40 : 56,
          flexDirection: "column",
          display: "flex",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isPortrait ? "column" : "row",
            gap: isPortrait ? 16 : 28,
            alignItems: isPortrait ? "stretch" : "flex-start",
            opacity: headerOp,
            transform: `translateY(${interpolate(headerOp, [0, 1], [14, 0])}px)`,
          }}
        >
          {props.heroImageSrc ? (
            <div
              style={{
                flex: isPortrait ? "none" : "0 0 34%",
                width: isPortrait ? "100%" : undefined,
                maxHeight: isPortrait ? height * 0.22 : height * 0.38,
                borderRadius: 18,
                overflow: "hidden",
                border: `1px solid ${props.accentColor}44`,
                boxShadow: "0 10px 30px rgba(62, 33, 10, 0.1)",
              }}
            >
              <Img
                src={props.heroImageSrc}
                alt={props.heroImageAlt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ) : null}

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: props.accentColor,
              }}
            >
              {LABEL}
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: theme.fontSerif,
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: isPortrait ? 40 : 46,
                lineHeight: 1.12,
                color: theme.textMain,
                maxWidth: "98%",
              }}
            >
              {props.title}
            </h2>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: isPortrait ? height * 0.38 : height * 0.34,
          }}
        >
          {activeIndex >= 0 && blocksMeta[activeIndex] ? (
            <div
              style={{
                width: "100%",
                maxWidth: isPortrait ? "100%" : "920px",
                padding: "20px 24px",
                borderRadius: 18,
                background: theme.surface,
                border: `1px solid rgba(51, 33, 17, 0.12)`,
                boxShadow: "0 8px 28px rgba(62, 33, 10, 0.08)",
                opacity: cardOp,
                transform: `translateY(${lift}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: props.accentColor,
                  marginBottom: 12,
                }}
              >
                {activeIndex + 1}. {blocksMeta[activeIndex].title}
              </div>
              <div
                style={{
                  fontSize:
                    blocksMeta[activeIndex].body.length > 220
                      ? 21
                      : blocksMeta[activeIndex].body.length > 150
                        ? 23
                        : 26,
                  lineHeight: 1.42,
                  color: theme.textMuted,
                }}
              >
                {blocksMeta[activeIndex].body}
              </div>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
