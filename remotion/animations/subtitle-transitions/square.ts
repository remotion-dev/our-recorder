import { getSafeSpace } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
  isWebCamAtBottom,
  isWebCamRight,
} from "../webcam-transitions/helpers";

const getEnterAndExitOfFullscreenBox = ({
  scene,
  otherScene,
  canvasHeight,
  canvasWidth,
}: {
  scene: VideoSceneAndMetadata;
  otherScene: VideoSceneAndMetadata;
  canvasHeight: number;
  canvasWidth: number;
}) => {
  if (otherScene === null || otherScene.type !== "video-scene") {
    return scene.layout.subLayout;
  }

  const previouslyAtBottom = isWebCamAtBottom(otherScene.finalWebcamPosition);
  const currentlyAtBottom = isWebCamAtBottom(scene.finalWebcamPosition);
  const changedVerticalPosition = previouslyAtBottom !== currentlyAtBottom;

  // Changing from top to bottom or vice versa will push the subtitle out of the screen
  if (changedVerticalPosition) {
    if (currentlyAtBottom) {
      return {
        ...scene.layout.subLayout,
        top: -scene.layout.subLayout.height,
      };
    }

    return {
      ...scene.layout.subLayout,
      top: canvasHeight,
    };
  }

  // If the vertical position has not changed, and the next scene also
  // has no display video, then nothing changes in the layout
  if (otherScene.layout.displayLayout === null) {
    return scene.layout.subLayout;
  }

  // Now we expect that the other scene has a display video, and the webcam will shrink

  // If the webcam moves to the top right corner, the subtitle should come from left corner
  if (!isWebCamRight(otherScene.finalWebcamPosition)) {
    return {
      ...scene.layout.subLayout,
      left: -scene.layout.subLayout.width,
    };
  }

  return {
    ...scene.layout.subLayout,
    left: canvasWidth,
  };
};

export const getSquareEnterOrExit = ({
  scene,
  canvasHeight,
  otherScene,
  canvasWidth,
}: {
  otherScene: SceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
  canvasWidth: number;
  canvasHeight: number;
}): Layout => {
  if (otherScene === null || otherScene.type !== "video-scene") {
    return scene.layout.subLayout;
  }

  if (scene.layout.displayLayout === null) {
    return getEnterAndExitOfFullscreenBox({
      canvasHeight,
      canvasWidth,
      otherScene,
      scene,
    });
  }

  if (
    isShrinkingToMiniature({
      firstScene: otherScene,
      secondScene: scene,
    })
  ) {
    const isWebcamLeft = !isWebCamRight(scene.finalWebcamPosition);
    const atBottom = isWebCamAtBottom(scene.finalWebcamPosition);
    const transX = scene.layout.subLayout.width + getSafeSpace("square");
    const transY =
      canvasHeight - scene.layout.subLayout.height - getSafeSpace("square") * 2;
    const previousAtBottom = isWebCamAtBottom(otherScene.finalWebcamPosition);
    const changedVerticalPosition = atBottom !== previousAtBottom;

    const translateX = isWebcamLeft ? transX : -transX;
    const translateY = changedVerticalPosition
      ? atBottom
        ? -transY
        : transY
      : 0;

    return {
      ...scene.layout.subLayout,
      left: scene.layout.subLayout.left + translateX,
      top: scene.layout.subLayout.top + translateY,
    };
  }

  if (
    isGrowingFromMiniature({
      firstScene: otherScene,
      secondScene: scene,
    })
  ) {
    const heightDifference =
      scene.layout.webcamLayout.height - otherScene.layout.webcamLayout.height;

    const previouslyAtBottom = isWebCamAtBottom(otherScene.finalWebcamPosition);
    const currentlyAtBottom = isWebCamAtBottom(scene.finalWebcamPosition);
    const changedVerticalPosition = previouslyAtBottom !== currentlyAtBottom;

    if (changedVerticalPosition) {
      return {
        ...scene.layout.subLayout,
        top:
          scene.layout.subLayout.top +
          (currentlyAtBottom
            ? -scene.layout.subLayout.height - getSafeSpace("square")
            : scene.layout.subLayout.height + getSafeSpace("square")),
      };
    }

    return {
      ...scene.layout.subLayout,
      left:
        scene.layout.subLayout.left +
        (isWebCamRight(scene.finalWebcamPosition) ? -canvasWidth : canvasWidth),
      top:
        scene.layout.subLayout.top +
        (currentlyAtBottom ? heightDifference : -heightDifference),
    };
  }

  const isSamePositionVertical =
    isWebCamRight(otherScene.finalWebcamPosition) ===
    isWebCamRight(scene.finalWebcamPosition);
  const isSamePositionHorizontal =
    isWebCamAtBottom(otherScene.finalWebcamPosition) ===
    isWebCamAtBottom(scene.finalWebcamPosition);

  const hasDisplay = scene.layout.displayLayout;
  if (!isSamePositionHorizontal && hasDisplay) {
    if (isWebCamAtBottom(scene.finalWebcamPosition)) {
      return {
        ...scene.layout.subLayout,
        top:
          scene.layout.subLayout.top +
          scene.layout.subLayout.height +
          getSafeSpace("square"),
      };
    }

    return {
      ...scene.layout.subLayout,
      top:
        scene.layout.subLayout.top -
        scene.layout.subLayout.height -
        getSafeSpace("square"),
    };
  }

  if (!isSamePositionHorizontal) {
    return {
      ...scene.layout.subLayout,
      top:
        scene.layout.subLayout.top +
        (isWebCamAtBottom(scene.finalWebcamPosition)
          ? -scene.layout.subLayout.height - getSafeSpace("square")
          : scene.layout.subLayout.height + getSafeSpace("square")),
    };
  }

  if (!isSamePositionVertical) {
    return {
      ...scene.layout.subLayout,
      left: isWebCamRight(scene.finalWebcamPosition)
        ? -canvasWidth
        : canvasWidth,
    };
  }

  return scene.layout.subLayout;
};
