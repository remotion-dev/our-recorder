import { interpolateStyles, translate } from "@remotion/animation-utils";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { SubtitleType } from "../../captions/Segment";
import type { Layout } from "../../layout/layout-types";
import { belowVideoSubtitleEnter, belowVideoSubtitleExit } from "./below-video";
import { getBoxedEnter, getBoxedExit } from "./boxed";
import {
  getOverlayedCenterSubtitleEnter,
  getOverlayedCenterSubtitleExit,
} from "./overlayed-center";

const getSubtitleExit = ({
  width,
  nextScene,
  scene,
  currentLayout,
  subtitleType,
}: {
  width: number;
  scene: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  currentLayout: Layout;
  subtitleType: SubtitleType;
}) => {
  if (subtitleType === "overlayed-center") {
    return getOverlayedCenterSubtitleExit({ nextScene, currentScene: scene });
  }

  if (subtitleType === "below-video") {
    return belowVideoSubtitleExit({ nextScene, currentScene: scene });
  }

  if (subtitleType === "boxed") {
    return getBoxedExit({ nextScene, currentLayout, scene, width });
  }

  throw new Error("Unknown subtitle type: " + subtitleType);
};

const getSubtitleEnterTransform = ({
  canvasWidth,
  canvasHeight,
  scene,
  previousScene,
  currentLayout,
  subtitleType,
}: {
  canvasWidth: number;
  canvasHeight: number;
  scene: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  currentLayout: Layout;
  subtitleType: SubtitleType;
}): string => {
  if (scene.type !== "video-scene") {
    throw new Error("no subtitles on non-video scenes");
  }

  if (subtitleType === "overlayed-center") {
    return getOverlayedCenterSubtitleEnter({
      previousScene,
      scene,
    });
  }

  if (subtitleType === "below-video") {
    return belowVideoSubtitleEnter({
      previousScene,
      scene,
    });
  }

  if (subtitleType === "boxed") {
    return getBoxedEnter({
      currentLayout,
      scene,
      canvasHeight,
      previousScene,
      canvasWidth,
    });
  }

  throw new Error("Unknown subtitle type: " + subtitleType);
};

export const getSubtitleTransform = ({
  enterProgress,
  exitProgress,
  canvasWidth,
  canvasHeight,
  nextScene,
  previousScene,
  scene,
  currentLayout,
  subtitleType,
}: {
  enterProgress: number;
  exitProgress: number;
  canvasWidth: number;
  canvasHeight: number;
  scene: VideoSceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  currentLayout: Layout;
  subtitleType: SubtitleType;
}): string => {
  const enter = getSubtitleEnterTransform({
    canvasHeight,
    canvasWidth,
    scene,
    previousScene,
    currentLayout,
    subtitleType,
  });

  const exit = getSubtitleExit({
    width: canvasWidth,
    nextScene,
    scene,
    currentLayout,
    subtitleType,
  });

  if (exitProgress > 0) {
    return interpolateStyles(
      exitProgress,
      [0, 1],
      [{ transform: translate(0, 0) }, { transform: exit }],
    ).transform as string;
  }

  return interpolateStyles(
    enterProgress,
    [0, 1],
    [{ transform: enter }, { transform: translate(0, 0) }],
    {},
  ).transform as string;
};
