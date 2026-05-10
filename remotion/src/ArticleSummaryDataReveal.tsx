import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useMemo } from "react";

import { allocateParagraphFrames } from "./utils/allocate-frames";
import { theme } from "./theme";
import type { DataRevealPayload, VideoPostProps } from "./types";

type Props = VideoPostProps & { dataReveal: DataRevealPayload };

function computePhaseEnds(durationInFrames: number, fps: number) {
  const totalSec = durationInFrames / fps;
  const minTailSec = 7;
  let titleSec = 2;
  let barsSec = 8;
  let highlightSec = 4;
  let sum = titleSec + barsSec + highlightSec;
  const maxPhaseSec = Math.max(0.01, totalSec - minTailSec);
  if (sum > maxPhaseSec) {
    const scale = maxPhaseSec / sum;
    titleSec *= scale;
    barsSec *= scale;
    highlightSec *= scale;
  }
  const r = (x: number) => Math.round(x * fps);
  const F_VIZ_TITLE_END = r(titleSec);
  const F_BARS_END = F_VIZ_TITLE_END + r(barsSec);
  const F_HIGHLIGHT_END = F_BARS_END + r(highlightSec);
  return { F_VIZ_TITLE_END, F_BARS_END, F_HIGHLIGHT_END };
}

export function ArticleSummaryDataReveal(props: Props) {
  const frame = useCurrentFrame();
  const { height, width, fps, durationInFrames } = useVideoConfig();
  const isPortrait = height > width;
  const { dataReveal, accentColor, heroImageSrc, heroImageAlt } = props;
  const { vizTitle, bars, highlight, highlightSub, source, takeaway, cta } =
    dataReveal;

  const { F_VIZ_TITLE_END, F_BARS_END, F_HIGHLIGHT_END } = useMemo(
    () => computePhaseEnds(durationInFrames, fps),
    [durationInFrames, fps],
  );

  const f = (sec: number) => Math.round(sec * fps);
  const F_CTA_START = durationInFrames - f(2.4);

  const takeawayParagraphs = useMemo(() => {
    const parts = takeaway
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) return parts;
    const one = takeaway.trim();
    return one ? [one] : [];
  }, [takeaway]);

  const takeawaySlots = useMemo(() => {
    const budget = Math.max(f(4), F_CTA_START - F_HIGHLIGHT_END);
    const durFrames = allocateParagraphFrames(
      takeawayParagraphs,
      budget,
      fps,
      2.4,
    );
    let cursor = F_HIGHLIGHT_END;
    return durFrames.map((duration) => {
      const start = cursor;
      cursor += duration;
      return { start, duration };
    });
  }, [F_HIGHLIGHT_END, F_CTA_START, takeawayParagraphs, fps]);

  const takeawayFontSize =
    takeaway.length > 420
      ? isPortrait
        ? 22
        : 24
      : takeaway.length > 260
        ? isPortrait
          ? 24
          : 27
        : isPortrait
          ? 26
          : 30;

  const padX = isPortrait ? 40 : 72;
  const padY = isPortrait ? 36 : 52;

  const vizTitleOpacity = interpolate(
    frame,
    [0, 24, F_VIZ_TITLE_END],
    [0, 1, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const barPhaseStart = F_VIZ_TITLE_END;
  const barPhaseLen = F_BARS_END - barPhaseStart;
  const n = Math.max(1, bars.length);
  const slot = barPhaseLen / n;

  const highlightT = interpolate(
    frame,
    [F_BARS_END, F_BARS_END + 36],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  const highlightScale = interpolate(highlightT, [0, 1], [0.88, 1]);

  const sourceOp = interpolate(
    frame,
    [F_BARS_END + 30, F_BARS_END + 72],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const topLayerOpacity = interpolate(
    frame,
    [F_HIGHLIGHT_END - 20, F_HIGHLIGHT_END + 28],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const inBarsPhase = frame >= barPhaseStart && frame < F_BARS_END;
  const inHighlightPhase = frame >= F_BARS_END && frame < F_HIGHLIGHT_END;
  const inTakeawayPhase = frame >= F_HIGHLIGHT_END;

  const ctaText = cta?.trim() ? cta : "Lire l’article complet";

  const ctaOp = interpolate(
    frame,
    [F_CTA_START, F_CTA_START + f(0.5)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  let activeTakeawayIndex = -1;
  for (let i = 0; i < takeawaySlots.length; i++) {
    const { start, duration } = takeawaySlots[i];
    if (frame >= start && frame < start + duration) {
      activeTakeawayIndex = i;
      break;
    }
  }
  if (
    activeTakeawayIndex < 0 &&
    inTakeawayPhase &&
    frame < F_CTA_START &&
    takeawaySlots.length > 0
  ) {
    activeTakeawayIndex = takeawaySlots.length - 1;
  }

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(185deg, ${theme.bg} 0%, ${accentColor}12 48%, ${theme.bgWarm} 100%)`,
        fontFamily: theme.fontBody,
        color: theme.textMain,
      }}
    >
      <AbsoluteFill
        style={{
          padding: `${padY}px ${padX}px`,
          opacity: topLayerOpacity,
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isPortrait ? "column" : "row",
            gap: isPortrait ? 18 : 28,
            alignItems: isPortrait ? "stretch" : "flex-start",
          }}
        >
          {heroImageSrc ? (
            <div
              style={{
                flex: isPortrait ? "none" : "0 0 36%",
                width: isPortrait ? "100%" : undefined,
                maxHeight: isPortrait ? height * 0.26 : height * 0.42,
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid ${accentColor}44`,
                opacity: vizTitleOpacity,
                boxShadow: "0 12px 36px rgba(62, 33, 10, 0.12)",
              }}
            >
              <Img
                src={heroImageSrc}
                alt={heroImageAlt || ""}
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
                margin: "0 0 10px",
                fontSize: isPortrait ? 15 : 16,
                color: theme.textMuted,
                fontWeight: 600,
              }}
            >
              {props.title}
            </p>

            <div style={{ opacity: vizTitleOpacity }}>
              <h2
                style={{
                  margin: "0 0 18px",
                  fontFamily: theme.fontSerif,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: isPortrait ? 34 : 40,
                  lineHeight: 1.14,
                  color: accentColor,
                }}
              >
                {vizTitle}
              </h2>
            </div>

            {inBarsPhase && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isPortrait ? 12 : 16,
                  marginTop: 6,
                }}
              >
                {bars.map((bar, i) => {
                  const start = barPhaseStart + i * slot;
                  const end = barPhaseStart + (i + 1) * slot;
                  const progress = interpolate(frame, [start, end], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.cubic),
                  });
                  const pct =
                    Math.min(1, bar.max > 0 ? bar.value / bar.max : 0) *
                    progress;

                  return (
                    <div
                      key={`${bar.label}-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          flex: "0 0 min(38%, 200px)",
                          fontSize: isPortrait ? 16 : 18,
                          fontWeight: 600,
                          color: theme.textMuted,
                          lineHeight: 1.25,
                        }}
                      >
                        {bar.label}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: isPortrait ? 30 : 36,
                          borderRadius: 12,
                          background: "rgba(51, 33, 17, 0.08)",
                          border: `1px solid ${accentColor}33`,
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${pct * 100}%`,
                            borderRadius: 11,
                            background: `linear-gradient(90deg, ${accentColor}dd, ${accentColor})`,
                            boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.08)",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          flex: "0 0 48px",
                          textAlign: "right",
                          fontSize: isPortrait ? 16 : 18,
                          fontWeight: 700,
                          fontVariantNumeric: "tabular-nums",
                          color: accentColor,
                          opacity: interpolate(progress, [0.55, 1], [0.35, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                          }),
                        }}
                      >
                        {Math.round(bar.value * progress)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>

      {inHighlightPhase && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: `${padY}px ${padX}px`,
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              textAlign: "center",
              transform: `scale(${highlightScale})`,
            }}
          >
            <div
              style={{
                fontFamily: theme.fontSerif,
                fontWeight: 600,
                fontStyle: "italic",
                fontSize: isPortrait ? 72 : 88,
                lineHeight: 1,
                color: accentColor,
                textShadow: "0 10px 40px rgba(0,0,0,0.08)",
              }}
            >
              {highlight}
            </div>
            {highlightSub && (
              <div
                style={{
                  marginTop: 12,
                  fontSize: isPortrait ? 22 : 26,
                  fontWeight: 600,
                  color: theme.textMuted,
                }}
              >
                {highlightSub}
              </div>
            )}
            <div
              style={{
                marginTop: 22,
                fontSize: isPortrait ? 17 : 19,
                color: theme.textMuted,
                maxWidth: "92%",
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.45,
                opacity: sourceOp,
              }}
            >
              Source : {source}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {inTakeawayPhase && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: `${padY}px ${padX}px`,
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          {activeTakeawayIndex >= 0 &&
            takeawayParagraphs[activeTakeawayIndex] !== undefined &&
            frame < F_CTA_START && (
              <p
                style={{
                  margin: 0,
                  maxWidth: "94%",
                  textAlign: "center",
                  fontSize: takeawayFontSize,
                  lineHeight: 1.48,
                  fontWeight: 600,
                  color: theme.textMain,
                  opacity: interpolate(
                    frame,
                    [
                      takeawaySlots[activeTakeawayIndex].start,
                      takeawaySlots[activeTakeawayIndex].start + 12,
                      takeawaySlots[activeTakeawayIndex].start +
                        takeawaySlots[activeTakeawayIndex].duration -
                        10,
                      takeawaySlots[activeTakeawayIndex].start +
                        takeawaySlots[activeTakeawayIndex].duration,
                    ],
                    [0, 1, 1, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  ),
                }}
              >
                {takeawayParagraphs[activeTakeawayIndex]}
              </p>
            )}

          <div
            style={{
              position: "absolute",
              left: padX,
              right: padX,
              bottom: padY,
              display: "flex",
              justifyContent: "center",
              opacity: ctaOp,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "12px 24px",
                borderRadius: 999,
                background: accentColor,
                color: "#fff",
                fontWeight: 700,
                fontSize: isPortrait ? 18 : 20,
                boxShadow: `0 12px 32px ${accentColor}55`,
              }}
            >
              {ctaText}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
