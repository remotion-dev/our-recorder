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

export const getBoxedEnterOrExit = ({
  currentLayout,
  scene,
  canvasHeight,
  otherScene,
  canvasWidth,
}: {
  otherScene: SceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
  canvasWidth: number;
  canvasHeight: number;
  currentLayout: Layout;
}): Layout => {
  if (otherScene === null || otherScene.type !== "video-scene") {
    return scene.layout.subLayout;
  }

  if (
    isShrinkingToMiniature({
      firstScene: otherScene,
      secondScene: scene,
    })
  ) {
    const isWebcamLeft = !isWebCamRight(scene.finalWebcamPosition);
    const atBottom = isWebCamAtBottom(scene.finalWebcamPosition);
    const transX = currentLayout.width + getSafeSpace("square");
    const transY =
      canvasHeight - currentLayout.height - getSafeSpace("square") * 2;
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
            ? -currentLayout.height - getSafeSpace("square")
            : currentLayout.height + getSafeSpace("square")),
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
          currentLayout.height +
          getSafeSpace("square"),
      };
    }

    return {
      ...scene.layout.subLayout,
      top:
        scene.layout.subLayout.top -
        currentLayout.height -
        getSafeSpace("square"),
    };
  }

  if (!isSamePositionHorizontal) {
    return {
      ...scene.layout.subLayout,
      top:
        scene.layout.subLayout.top +
        (isWebCamAtBottom(scene.finalWebcamPosition)
          ? -currentLayout.height - getSafeSpace("square")
          : currentLayout.height + getSafeSpace("square")),
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
