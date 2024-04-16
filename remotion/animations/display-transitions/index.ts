import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import { interpolateLayout } from "../interpolate-layout";
import { getLandscapeDisplayEnter, getLandscapeDisplayExit } from "./landscape";
import { getSquareDisplayEnterOrExit } from "./square";

const getDisplayExit = ({
  currentScene,
  nextScene,
  canvasWidth,
  canvasHeight,
  canvasLayout,
}: {
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  canvasWidth: number;
  canvasHeight: number;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (canvasLayout === "landscape") {
    return getLandscapeDisplayExit({
      currentScene,
      nextScene,
      canvasWidth,
      canvasHeight,
    });
  }

  if (canvasLayout === "square") {
    return getSquareDisplayEnterOrExit({
      currentScene,
      otherScene: nextScene,
      canvasWidth,
      canvasHeight,
    });
  }

  throw new Error("Unknown canvas layout: " + canvasLayout);
};

const getDisplayEnter = ({
  currentScene,
  previousScene,
  canvasWidth,
  canvasHeight,
  canvasLayout,
}: {
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  canvasWidth: number;
  canvasHeight: number;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (canvasLayout === "landscape") {
    return getLandscapeDisplayEnter({
      currentScene,
      previousScene,
      width: canvasWidth,
    });
  }

  if (canvasLayout === "square") {
    return getSquareDisplayEnterOrExit({
      currentScene,
      otherScene: previousScene,
      canvasWidth,
      canvasHeight,
    });
  }

  throw new Error("Unknown canvas layout: " + canvasLayout);
};

const getDisplayTransitionOrigins = ({
  currentScene,
  nextScene,
  previousScene,
  canvasWidth,
  canvasHeight,
  canvasLayout,
}: {
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  canvasLayout: CanvasLayout;
  canvasWidth: number;
  canvasHeight: number;
}) => {
  const enter = getDisplayEnter({
    currentScene,
    previousScene,
    canvasWidth,
    canvasLayout,
    canvasHeight,
  });

  const exit = getDisplayExit({
    currentScene,
    nextScene,
    canvasWidth,
    canvasHeight,
    canvasLayout,
  });

  return {
    enter,
    exit,
  };
};

const shouldTransitionDisplayVideo = ({
  previousScene,
}: {
  previousScene: SceneAndMetadata | null;
}) => {
  if (previousScene === null) {
    return false;
  }

  if (previousScene.type !== "video-scene") {
    return false;
  }

  if (previousScene.videos.display === null) {
    return false;
  }

  return true;
};

export const getDisplayPosition = ({
  enterProgress,
  exitProgress,
  canvasWidth,
  canvasHeight,
  nextScene,
  previousScene,
  currentScene,
  canvasLayout,
}: {
  enterProgress: number;
  exitProgress: number;
  canvasWidth: number;
  canvasHeight: number;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (
    currentScene.type !== "video-scene" ||
    currentScene.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  const { enter: enterState, exit: exitState } = getDisplayTransitionOrigins({
    currentScene,
    nextScene,
    previousScene,
    canvasWidth,
    canvasHeight,
    canvasLayout,
  });

  if (exitProgress > 0) {
    return interpolateLayout({
      firstLayout: currentScene.layout.displayLayout,
      secondLayout: exitState,
      progress: exitProgress,
    });
  }

  const interpolatedLayout = interpolateLayout({
    firstLayout: enterState,
    secondLayout: currentScene.layout.displayLayout,
    progress: enterProgress,
  });

  return {
    ...interpolatedLayout,
    // Switch to new video in the middle of the transition
    opacity: shouldTransitionDisplayVideo({ previousScene })
      ? enterProgress > 0.5
        ? 1
        : 0
      : 1,
  };
};
