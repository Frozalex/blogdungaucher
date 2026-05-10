import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { padTakeaways } from "./utils/text";
import { theme } from "./theme";
import type { VideoPostProps } from "./types";

const LABEL = "En résumé";

export function ArticleSummaryClassic(props: VideoPostProps) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isPortrait = height > width;

  const [p1, p2, p3] = padTakeaways(props.keyTakeaways, props.excerpt);

  const blocks = [
    { title: "Idée 1", body: p1, start: 120 },
    { title: "Idée 2", body: p2, start: 480 },
    { title: "Idée 3", body: p3, start: 840 },
  ];

  const headerOp = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

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
          padding: isPortrait ? 44 : 64,
          flexDirection: "column",
          display: "flex",
          gap: 28,
        }}
      >
        <div
          style={{
            opacity: headerOp,
            transform: `translateY(${interpolate(headerOp, [0, 1], [18, 0])}px)`,
          }}
        >
          <p
            style={{
              margin: "0 0 10px",
              fontSize: 22,
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
              fontSize: isPortrait ? 44 : 48,
              lineHeight: 1.12,
              color: theme.textMain,
              maxWidth: "95%",
            }}
          >
            {props.title}
          </h2>
        </div>

        {props.heroImageSrc && (
          <div
            style={{
              width: "100%",
              maxHeight: isPortrait ? height * 0.22 : height * 0.26,
              borderRadius: 18,
              overflow: "hidden",
              opacity: interpolate(frame, [40, 90], [0, 1], {
                extrapolateRight: "clamp",
              }),
              border: `1px solid ${props.accentColor}55`,
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
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {blocks.map((b, index) => {
            const local = frame - b.start;
            const op = spring({
              frame: Math.max(0, local),
              fps,
              config: { damping: 22, stiffness: 110 },
            });
            const lift = interpolate(op, [0, 1], [14, 0]);

            return (
              <div
                key={b.title}
                style={{
                  padding: "22px 26px",
                  borderRadius: 18,
                  background: theme.surface,
                  border: `1px solid rgba(51, 33, 17, 0.12)`,
                  boxShadow: "0 8px 28px rgba(62, 33, 10, 0.08)",
                  opacity: op,
                  transform: `translateY(${lift}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: props.accentColor,
                    marginBottom: 10,
                  }}
                >
                  {index + 1}. {b.title}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    lineHeight: 1.4,
                    color: theme.textMuted,
                  }}
                >
                  {b.body}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
