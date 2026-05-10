import { Player } from "@remotion/player";

import { ArticleSummary } from "@remotion/ArticleSummary";
import type { VideoPostProps } from "@remotion/types";
import {
  SUMMARY_DURATION_FRAMES,
  VIDEO_FPS,
} from "@remotion/video-durations";

const FPS = VIDEO_FPS;
const SUMMARY_FRAMES = SUMMARY_DURATION_FRAMES;

type Aspect = "16:9" | "9:16";

export default function RemotionSummaryPlayer(props: {
  inputProps: VideoPostProps;
  aspect: Aspect;
}) {
  const { inputProps, aspect } = props;
  const landscape = aspect === "16:9";
  const compositionWidth = landscape ? 1920 : 1080;
  const compositionHeight = landscape ? 1080 : 1920;

  return (
    <Player
      component={ArticleSummary}
      inputProps={inputProps}
      durationInFrames={SUMMARY_FRAMES}
      fps={FPS}
      compositionWidth={compositionWidth}
      compositionHeight={compositionHeight}
      controls
      style={{
        width: "100%",
        maxHeight: "min(75vh, 560px)",
      }}
      acknowledgeRemotionLicense
    />
  );
}
