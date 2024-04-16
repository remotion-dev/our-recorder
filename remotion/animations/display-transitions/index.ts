import { interpolate } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
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
    return {
      left: Math.round(
        interpolate(
          exitProgress,
          [0, 1],
          [currentScene.layout.displayLayout.left, exitState.left],
        ),
      ),
      top: Math.round(
        interpolate(
          exitProgress,
          [0, 1],
          [currentScene.layout.displayLayout.top, exitState.top],
        ),
      ),
      width: Math.round(
        interpolate(
          exitProgress,
          [0, 1],
          [currentScene.layout.displayLayout.width, exitState.width],
        ),
      ),
      height: Math.round(
        interpolate(
          exitProgress,
          [0, 1],
          [currentScene.layout.displayLayout.height, exitState.height],
        ),
      ),
      opacity: interpolate(
        exitProgress,
        [0, 1],
        [currentScene.layout.displayLayout.opacity, exitState.opacity],
      ),
      borderRadius: interpolate(
        exitProgress,
        [0, 1],
        [
          currentScene.layout.displayLayout.borderRadius,
          exitState.borderRadius,
        ],
      ),
    };
  }

  const enterX = interpolate(
    enterProgress,
    [0, 1],
    [enterState.left, currentScene.layout.displayLayout.left],
  );
  const enterY = interpolate(
    enterProgress,
    [0, 1],
    [enterState.top, currentScene.layout.displayLayout.top],
  );
  const enterWidth = interpolate(
    enterProgress,
    [0, 1],
    [enterState.width, currentScene.layout.displayLayout.width],
  );
  const enterHeight = interpolate(
    enterProgress,
    [0, 1],
    [enterState.height, currentScene.layout.displayLayout.height],
  );
  const borderRadius = interpolate(
    enterProgress,
    [0, 1],
    [enterState.borderRadius, currentScene.layout.displayLayout.borderRadius],
  );

  return {
    left: Math.round(enterX),
    top: Math.round(enterY),
    width: enterWidth,
    height: enterHeight,
    // Switch to new video in the middle of the transition
    opacity: shouldTransitionDisplayVideo({ previousScene })
      ? enterProgress > 0.5
        ? 1
        : 0
      : 1,
    borderRadius,
  };
};
