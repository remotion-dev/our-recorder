import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import { interpolateLayout } from "../interpolate-layout";
import { getLandscapeWebCamStartOrEndLayout } from "./landscape";
import { getSquareWebcamStartOrEndLayout } from "./square";

const getWebCamStartOrEndLayout = ({
  canvasWidth,
  canvasHeight,
  canvasLayout,
  otherScene,
  currentScene,
}: {
  otherScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  canvasWidth: number;
  canvasHeight: number;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (canvasLayout === "landscape") {
    return getLandscapeWebCamStartOrEndLayout({
      currentScene,
      otherScene,
      canvasWidth,
    });
  }

  if (canvasLayout === "square") {
    return getSquareWebcamStartOrEndLayout({
      currentScene,
      canvasHeight,
      otherScene,
    });
  }

  throw new Error(`Unknown canvas layout: ${canvasLayout}`);
};

const shouldTransitionWebcamVideo = ({
  previousScene,
}: {
  previousScene: SceneAndMetadata | null;
}) => {
  if (!previousScene) {
    return false;
  }

  if (previousScene.type !== "video-scene") {
    return false;
  }

  return true;
};

export const getWebcamLayout = ({
  enterProgress,
  exitProgress,
  canvasWidth,
  canvasHeight,
  canvasLayout,
  currentScene,
  nextScene,
  previousScene,
}: {
  enterProgress: number;
  exitProgress: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  previousScene: SceneAndMetadata | null;
}): React.CSSProperties => {
  const startLayout = getWebCamStartOrEndLayout({
    canvasLayout,
    currentScene,
    otherScene: previousScene,
    canvasWidth,
    canvasHeight,
  });

  const endLayout = getWebCamStartOrEndLayout({
    canvasLayout,
    currentScene,
    canvasHeight,
    otherScene: nextScene,
    canvasWidth,
  });

  if (exitProgress > 0) {
    return interpolateLayout(
      currentScene.layout.webcamLayout,
      endLayout,
      exitProgress,
    );
  }

  return {
    ...interpolateLayout(
      startLayout,
      currentScene.layout.webcamLayout,
      enterProgress,
    ),
    // Switch opacity in the middle of the transition
    opacity: shouldTransitionWebcamVideo({ previousScene })
      ? enterProgress > 0.5
        ? 1
        : 0
      : 1,
  };
};
