import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { SubtitleType } from "../../captions/Segment";
import type { Layout } from "../../layout/layout-types";
import { interpolateLayout } from "../interpolate-layout";
import { belowVideoSubtitleEnter, belowVideoSubtitleExit } from "./below-video";
import { getBoxedEnter, getBoxedExit } from "./boxed";
import {
  getOverlayedCenterSubtitleEnter,
  getOverlayedCenterSubtitleExit,
} from "./overlayed-center";

const getSubtitleExit = ({
  canvasWidth,
  nextScene,
  scene,
  currentLayout,
  subtitleType,
}: {
  canvasWidth: number;
  scene: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  currentLayout: Layout;
  subtitleType: SubtitleType;
}): Layout => {
  if (subtitleType === "overlayed-center") {
    return getOverlayedCenterSubtitleExit({ nextScene, currentScene: scene });
  }

  if (subtitleType === "below-video") {
    return belowVideoSubtitleExit({ nextScene, currentScene: scene });
  }

  if (subtitleType === "boxed") {
    return getBoxedExit({
      nextScene,
      currentLayout,
      scene,
      canvasWidth,
    });
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
}): Layout => {
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
}): Layout => {
  const enter = getSubtitleEnterTransform({
    canvasHeight,
    canvasWidth,
    scene,
    previousScene,
    currentLayout,
    subtitleType,
  });

  const exit = getSubtitleExit({
    canvasWidth,
    nextScene,
    scene,
    currentLayout,
    subtitleType,
  });

  if (exitProgress > 0) {
    return interpolateLayout(currentLayout, exit, exitProgress);
  }

  return interpolateLayout(enter, currentLayout, enterProgress);
};
