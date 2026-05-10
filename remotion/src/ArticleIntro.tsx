import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { Subtitles } from "./components/Subtitles";
import { splitIntoPhrases } from "./utils/text";
import { theme } from "./theme";
import type { VideoPostProps } from "./types";

export function ArticleIntro(props: VideoPostProps) {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const isPortrait = height > width;

  /** Bandeau tags : ~68–92 % de la durée pour laisser place au titre, sous-titres et CTA */
  const TAGS_START = Math.floor(durationInFrames * 0.68);
  const TAGS_END = Math.floor(durationInFrames * 0.92);

  const titleOp = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const imgStart = 45;
  const imgShown = interpolate(frame, [imgStart, imgStart + 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const phrases = splitIntoPhrases(props.excerpt, 5);
  const phraseStart = 95;
  const phraseWindow = Math.floor(
    (TAGS_START - phraseStart - 22) / Math.max(phrases.length, 1),
  );
  const segments = phrases.map((text, i) => ({
    text,
    start: phraseStart + i * phraseWindow,
    end: phraseStart + (i + 1) * phraseWindow - 4,
  }));

  const tagBurst = interpolate(frame, [TAGS_START, TAGS_START + 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ctaOp = interpolate(
    frame,
    [
      TAGS_END,
      TAGS_END + 24,
      durationInFrames - 18,
      durationInFrames - 2,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(165deg, ${props.accentColor}26 0%, ${theme.bg} 42%, ${theme.bgWarm} 100%)`,
        fontFamily: theme.fontBody,
        color: theme.textMain,
      }}
    >
      <AbsoluteFill
        style={{
          padding: isPortrait ? "48px 36px" : "56px 72px",
          justifyContent: "flex-start",
        }}
      >
        <h1
          style={{
            margin: 0,
            maxWidth: isPortrait ? "100%" : "85%",
            fontFamily: theme.fontSerif,
            fontWeight: 500,
            fontStyle: "italic",
            fontSize: isPortrait ? 52 : 56,
            lineHeight: 1.08,
            color: props.accentColor,
            opacity: titleOp,
            transform: `translateY(${interpolate(titleOp, [0, 1], [24, 0])}px)`,
          }}
        >
          {props.title}
        </h1>

        {props.heroImageSrc && frame >= imgStart && (
          <div
            style={{
              marginTop: isPortrait ? 28 : 36,
              width: "100%",
              maxHeight: isPortrait ? height * 0.38 : height * 0.42,
              opacity: imgShown,
              borderRadius: 20,
              overflow: "hidden",
              border: `2px solid ${props.accentColor}44`,
              boxShadow: "0 18px 50px rgba(62, 33, 10, 0.14)",
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
      </AbsoluteFill>

      <Subtitles segments={segments} bottom={isPortrait ? "22%" : "12%"} />

      {frame >= TAGS_START && frame < TAGS_END && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              maxWidth: "90%",
              opacity: tagBurst,
              transform: `scale(${0.96 + tagBurst * 0.04})`,
            }}
          >
            {props.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: `2px solid ${props.accentColor}`,
                  color: props.accentColor,
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  background: "rgba(255,255,255,0.72)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {frame >= TAGS_END && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: isPortrait ? "6%" : "5%",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              opacity: ctaOp,
              fontFamily: theme.fontDisplay,
              fontSize: 26,
              fontWeight: 600,
              color: theme.green,
            }}
          >
            Lire l’article sur le blog
          </span>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
