import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import type { Theme } from "../../config/themes";
import { COLORS } from "../../config/themes";
import { shouldInlineTransitionSubtitles } from "../animations/caption-transitions/should-transition-subtitle";
import { getSubtitleTransform } from "../animations/caption-transitions/subtitle-transitions";
import { Layout } from "../layout/layout-types";
import { Captions } from "./Captions";
import {
  getBorderWidthForSubtitles,
  getSubtitlesFontSize,
  getSubtitlesLines,
} from "./Segment";
import {
  TransitionFromPreviousSubtitles,
  TransitionToNextSubtitles,
} from "./TransitionBetweenSubtitles";
import { useCaptions } from "./editor/captions-provider";
import { layoutCaptions } from "./processing/layout-captions";
import { postprocessCaptions } from "./processing/postprocess-subs";

const LINE_HEIGHT = 2;

export const Subs: React.FC<{
  trimStart: number;
  canvasLayout: CanvasLayout;
  scene: VideoSceneAndMetadata;
  enterProgress: number;
  exitProgress: number;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  theme: Theme;
  subtitleLayout: Layout;
}> = ({
  trimStart,
  canvasLayout,
  scene,
  enterProgress,
  exitProgress,
  nextScene,
  previousScene,
  theme,
  subtitleLayout,
}) => {
  const { width, height } = useVideoConfig();

  const shouldTransitionToNext = shouldInlineTransitionSubtitles({
    currentScene: scene,
    nextScene,
  });
  const shouldTransitionFromPrevious = shouldInlineTransitionSubtitles({
    currentScene: scene,
    nextScene: previousScene,
  });

  const whisperOutput = useCaptions();

  const subtitleFontSize = getSubtitlesFontSize();

  const subtitleLines = getSubtitlesLines({
    boxHeight: subtitleLayout.height,
    fontSize: subtitleFontSize,
  });

  const postprocessed = useMemo(() => {
    const words = postprocessCaptions({
      subTypes: whisperOutput,
    });

    return layoutCaptions({
      boxWidth: subtitleLayout.width,
      maxLines: subtitleLines,
      fontSize: subtitleFontSize,
      canvasLayout,
      words,
    });
  }, [
    whisperOutput,
    subtitleLayout,
    subtitleLines,
    subtitleFontSize,
    canvasLayout,
  ]);

  const outer: React.CSSProperties = useMemo(() => {
    const backgroundColor = COLORS[theme].CAPTIONS_BACKGROUND;

    return {
      fontSize: subtitleFontSize,
      display: "flex",
      lineHeight: LINE_HEIGHT,
      borderWidth: getBorderWidthForSubtitles(),
      borderStyle: "solid",
      borderColor: COLORS[theme].BORDER_COLOR,
      backgroundColor,
      justifyContent: "center",
      ...getSubtitleTransform({
        enterProgress,
        exitProgress,
        canvasHeight: height,
        nextScene,
        previousScene,
        scene,
        canvasWidth: width,
        subtitleLayout,
      }),
    };
  }, [
    enterProgress,
    exitProgress,
    height,
    nextScene,
    previousScene,
    scene,
    subtitleFontSize,
    theme,
    width,
  ]);

  return (
    <AbsoluteFill style={outer}>
      <TransitionFromPreviousSubtitles
        shouldTransitionFromPreviousSubtitle={shouldTransitionFromPrevious}
      >
        <TransitionToNextSubtitles
          shouldTransitionToNextsSubtitles={shouldTransitionToNext}
        >
          <Captions
            canvasLayout={canvasLayout}
            fontSize={subtitleFontSize}
            lines={subtitleLines}
            segments={postprocessed.segments}
            theme={theme}
            trimStart={trimStart}
          />
        </TransitionToNextSubtitles>
      </TransitionFromPreviousSubtitles>
    </AbsoluteFill>
  );
};
