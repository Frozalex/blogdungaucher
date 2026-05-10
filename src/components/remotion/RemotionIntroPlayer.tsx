import { Player } from "@remotion/player";

import { ArticleIntro } from "@remotion/ArticleIntro";
import type { VideoPostProps } from "@remotion/types";
import {
  INTRO_DURATION_FRAMES,
  VIDEO_FPS,
} from "@remotion/video-durations";

const FPS = VIDEO_FPS;
const INTRO_FRAMES = INTRO_DURATION_FRAMES;

type Aspect = "16:9" | "9:16";

export default function RemotionIntroPlayer(props: {
  inputProps: VideoPostProps;
  aspect: Aspect;
}) {
  const { inputProps, aspect } = props;
  const landscape = aspect === "16:9";
  const compositionWidth = landscape ? 1920 : 1080;
  const compositionHeight = landscape ? 1080 : 1920;

  return (
    <Player
      component={ArticleIntro}
      inputProps={inputProps}
      durationInFrames={INTRO_FRAMES}
      fps={FPS}
      compositionWidth={compositionWidth}
      compositionHeight={compositionHeight}
      controls
      style={{
        width: "100%",
        maxHeight: "min(70vh, 520px)",
      }}
      acknowledgeRemotionLicense
    />
  );
}
