import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { theme } from "./theme";
import type { DataRevealPayload, VideoPostProps } from "./types";

type Props = VideoPostProps & { dataReveal: DataRevealPayload };

export function ArticleSummaryDataReveal(props: Props) {
  const frame = useCurrentFrame();
  const { height, width, fps, durationInFrames } = useVideoConfig();
  const isPortrait = height > width;
  const { dataReveal, accentColor } = props;
  const { vizTitle, bars, highlight, highlightSub, source, takeaway, cta } =
    dataReveal;

  /** 0–5 s titre viz · 5–20 s barres · 20–30 s highlight · 30 s → fin : synthèse enrichie */
  const f = (sec: number) => Math.round(sec * fps);
  const F_VIZ_TITLE_END = f(5);
  const F_BARS_END = f(20);
  const F_HIGHLIGHT_END = f(30);

  const takeawayParagraphs = (() => {
    const parts = takeaway
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) return parts;
    const one = takeaway.trim();
    return one ? [one] : [];
  })();

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
    [0, 36, F_VIZ_TITLE_END],
    [0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
  );

  const barPhaseStart = F_VIZ_TITLE_END;
  const barPhaseLen = F_BARS_END - barPhaseStart;
  const n = Math.max(1, bars.length);
  const slot = barPhaseLen / n;

  const highlightT = interpolate(
    frame,
    [F_BARS_END, F_BARS_END + 40],
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
    [F_BARS_END + 36, F_BARS_END + 90],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const takeawayOp = interpolate(
    frame,
    [F_HIGHLIGHT_END + 12, F_HIGHLIGHT_END + 48],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
  );

  const ctaOp = interpolate(
    frame,
    [durationInFrames - f(2.2), durationInFrames - f(0.6)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /** Masque la couche du haut quand la synthèse occupe l’écran */
  const topLayerOpacity = interpolate(
    frame,
    [F_HIGHLIGHT_END - 24, F_HIGHLIGHT_END + 36],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const inBarsPhase = frame >= barPhaseStart && frame < F_BARS_END;
  const inHighlightPhase = frame >= F_BARS_END && frame < F_HIGHLIGHT_END;
  const inTakeawayPhase = frame >= F_HIGHLIGHT_END;

  const ctaText = cta?.trim() ? cta : "Lire l’article complet";

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(185deg, ${theme.bg} 0%, ${accentColor}12 48%, ${theme.bgWarm} 100%)`,
        fontFamily: theme.fontBody,
        color: theme.textMain,
      }}
    >
      {/* Couche A+B : article + titre viz (+ barres intégrées sous le titre) */}
      <AbsoluteFill
        style={{
          padding: `${padY}px ${padX}px`,
          opacity: topLayerOpacity,
          zIndex: 1,
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
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
              margin: "0 0 24px",
              fontFamily: theme.fontSerif,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: isPortrait ? 38 : 44,
              lineHeight: 1.15,
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
              gap: isPortrait ? 14 : 18,
              marginTop: 8,
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
                Math.min(1, bar.max > 0 ? bar.value / bar.max : 0) * progress;

              return (
                <div
                  key={`${bar.label}-${i}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span
                    style={{
                      flex: "0 0 min(38%, 200px)",
                      fontSize: isPortrait ? 17 : 19,
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
                      height: isPortrait ? 34 : 40,
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
                      flex: "0 0 52px",
                      textAlign: "right",
                      fontSize: isPortrait ? 17 : 19,
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
      </AbsoluteFill>

      {/* Couche C : 20–28 s */}
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
          <div style={{ textAlign: "center", transform: `scale(${highlightScale})` }}>
            <div
              style={{
                fontFamily: theme.fontSerif,
                fontWeight: 600,
                fontStyle: "italic",
                fontSize: isPortrait ? 76 : 96,
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
                  marginTop: 14,
                  fontSize: isPortrait ? 24 : 28,
                  fontWeight: 600,
                  color: theme.textMuted,
                }}
              >
                {highlightSub}
              </div>
            )}
            <div
              style={{
                marginTop: 28,
                fontSize: isPortrait ? 18 : 21,
                color: theme.textMuted,
                maxWidth: "92%",
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.45,
                opacity: sourceOp,
              }}
            >
              Source — {source}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Couche D : synthèse finale (plus longue sur timeline ~55 s) */}
      {inTakeawayPhase && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "stretch",
            padding: `${padY}px ${padX}px ${padY + 16}px`,
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          <div style={{ opacity: takeawayOp }}>
            {takeawayParagraphs.map((para, pi) => (
              <p
                key={pi}
                style={{
                  margin: pi === 0 ? "0 0 18px" : "0 0 16px",
                  fontSize: takeawayFontSize,
                  lineHeight: 1.48,
                  fontWeight: pi === 0 ? 600 : 500,
                  color: theme.textMain,
                }}
              >
                {para}
              </p>
            ))}
            <div
              style={{
                opacity: ctaOp,
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 26px",
                borderRadius: 999,
                background: accentColor,
                color: "#fff",
                fontWeight: 700,
                fontSize: isPortrait ? 20 : 22,
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
