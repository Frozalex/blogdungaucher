import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

type Segment = { text: string; start: number; end: number };

export function Subtitles({
  segments,
  bottom = "8%",
}: {
  segments: Segment[];
  bottom?: string;
}) {
  const frame = useCurrentFrame();
  const active = segments.find((s) => frame >= s.start && frame < s.end);

  const opacity = active
    ? interpolate(
        frame,
        [active.start, active.start + 8, active.end - 10, active.end],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 0;

  if (!active) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: bottom,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          maxWidth: "88%",
          padding: "14px 22px",
          borderRadius: 14,
          background: "rgba(24, 24, 27, 0.78)",
          color: "#f4f4f5",
          fontFamily: 'Outfit, "Segoe UI", sans-serif',
          fontSize: 28,
          fontWeight: 500,
          lineHeight: 1.35,
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
}
