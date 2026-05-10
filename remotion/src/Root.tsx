import { Composition } from "remotion";

import { ArticleIntro } from "./ArticleIntro";
import { ArticleSummary } from "./ArticleSummary";
import { defaultVideoProps, sampleDataRevealProps } from "./post-props";
import {
  INTRO_DURATION_FRAMES,
  SUMMARY_DURATION_FRAMES,
  VIDEO_FPS,
} from "./video-durations";

const FPS = VIDEO_FPS;
const INTRO_FRAMES = INTRO_DURATION_FRAMES;
const SUMMARY_FRAMES = SUMMARY_DURATION_FRAMES;

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="ArticleIntro-169"
        component={ArticleIntro}
        durationInFrames={INTRO_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={defaultVideoProps}
      />
      <Composition
        id="ArticleIntro-916"
        component={ArticleIntro}
        durationInFrames={INTRO_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={defaultVideoProps}
      />
      <Composition
        id="ArticleSummary-169"
        component={ArticleSummary}
        durationInFrames={SUMMARY_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={defaultVideoProps}
      />
      <Composition
        id="ArticleSummary-916"
        component={ArticleSummary}
        durationInFrames={SUMMARY_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={defaultVideoProps}
      />
      <Composition
        id="ArticleSummary-169-dataRevealDemo"
        component={ArticleSummary}
        durationInFrames={SUMMARY_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={sampleDataRevealProps}
      />
      <Composition
        id="ArticleSummary-916-dataRevealDemo"
        component={ArticleSummary}
        durationInFrames={SUMMARY_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={sampleDataRevealProps}
      />
    </>
  );
}
