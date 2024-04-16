import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { SubtitleType } from "../../captions/Segment";
import type { Layout } from "../../layout/layout-types";
import { interpolateLayout } from "../interpolate-layout";
import { belowVideoSubtitleEnterOrExit } from "./below-video";
import { getBoxedEnterOrExit } from "./boxed";
import { getOverlayedCenterSubtitleEnterOrExit } from "./overlayed-center";

const getSubtitleExit = ({
  canvasWidth,
  nextScene,
  scene,
  currentLayout,
  subtitleType,
  canvasHeight,
}: {
  canvasWidth: number;
  canvasHeight: number;
  scene: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  currentLayout: Layout;
  subtitleType: SubtitleType;
}): Layout => {
  if (subtitleType === "overlayed-center") {
    return getOverlayedCenterSubtitleEnterOrExit({
      otherScene: nextScene,
      scene,
    });
  }

  if (subtitleType === "below-video") {
    return belowVideoSubtitleEnterOrExit({ otherScene: nextScene, scene });
  }

  if (subtitleType === "boxed") {
    return getBoxedEnterOrExit({
      otherScene: nextScene,
      currentLayout,
      scene,
      canvasWidth,
      canvasHeight,
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
    return getOverlayedCenterSubtitleEnterOrExit({
      otherScene: previousScene,
      scene,
    });
  }

  if (subtitleType === "below-video") {
    return belowVideoSubtitleEnterOrExit({
      otherScene: previousScene,
      scene,
    });
  }

  if (subtitleType === "boxed") {
    return getBoxedEnterOrExit({
      currentLayout,
      scene,
      canvasHeight,
      otherScene: previousScene,
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
    canvasHeight,
  });

  if (exitProgress > 0) {
    return interpolateLayout(currentLayout, exit, exitProgress);
  }

  return interpolateLayout(enter, currentLayout, enterProgress);
};
