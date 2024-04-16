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

export const getBoxedExit = ({
  nextScene,
  scene,
  currentLayout,
  canvasWidth,
}: {
  nextScene: SceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
  currentLayout: Layout;
  canvasWidth: number;
}): Layout => {
  if (nextScene === null || nextScene.type !== "video-scene") {
    return currentLayout;
  }

  if (isGrowingFromMiniature({ firstScene: scene, secondScene: nextScene })) {
    const isLeft = !isWebCamRight(scene.finalWebcamPosition);
    const webcamTranslation =
      nextScene.layout.webcamLayout.top - scene.layout.webcamLayout.top;

    return {
      ...currentLayout,
      left: isLeft
        ? currentLayout.left + currentLayout.width + getSafeSpace("square")
        : currentLayout.left - currentLayout.width - getSafeSpace("square"),
      top: currentLayout.top + webcamTranslation,
    };
  }

  if (isShrinkingToMiniature({ firstScene: scene, secondScene: nextScene })) {
    const isAtBottomBefore = isWebCamAtBottom(scene.finalWebcamPosition);
    const isAtBottomAfter = isWebCamAtBottom(nextScene.finalWebcamPosition);
    if (isAtBottomBefore === isAtBottomAfter) {
      return {
        ...currentLayout,
        left:
          currentLayout.left +
          (-currentLayout.width - currentLayout.left - getSafeSpace("square")),
      };
    }

    return {
      ...currentLayout,
      top:
        currentLayout.top +
        (isAtBottomAfter
          ? -currentLayout.height - getSafeSpace("square")
          : currentLayout.height + getSafeSpace("square")),
    };
  }

  const isSamePositionVertical =
    isWebCamRight(nextScene.finalWebcamPosition) ===
    isWebCamRight(scene.finalWebcamPosition);

  const isSamePositionHorizontal =
    isWebCamAtBottom(nextScene.finalWebcamPosition) ===
    isWebCamAtBottom(scene.finalWebcamPosition);

  const hasDisplay = scene.layout.displayLayout;
  if (!isSamePositionHorizontal && hasDisplay) {
    if (isWebCamAtBottom(scene.finalWebcamPosition)) {
      return {
        ...currentLayout,
        top: currentLayout.top + currentLayout.height + getSafeSpace("square"),
      };
    }

    return {
      ...currentLayout,
      top: currentLayout.top - currentLayout.height - getSafeSpace("square"),
    };
  }

  if (!isSamePositionHorizontal) {
    return {
      ...currentLayout,
      top: isWebCamAtBottom(scene.finalWebcamPosition)
        ? -(currentLayout.height + getSafeSpace("square"))
        : currentLayout.height + getSafeSpace("square"),
    };
  }

  if (!isSamePositionVertical) {
    return {
      ...currentLayout,
      // TODO: We probably don't want that
      left: isWebCamRight(scene.finalWebcamPosition)
        ? currentLayout.left - canvasWidth
        : currentLayout.left + canvasWidth,
    };
  }

  return currentLayout;
};

export const getBoxedEnter = ({
  currentLayout,
  scene,
  canvasHeight,
  previousScene,
  canvasWidth,
}: {
  previousScene: SceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
  canvasWidth: number;
  canvasHeight: number;
  currentLayout: Layout;
}): Layout => {
  if (previousScene === null || previousScene.type !== "video-scene") {
    return scene.layout.subLayout;
  }

  if (
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: scene,
    })
  ) {
    const isWebcamLeft = !isWebCamRight(scene.finalWebcamPosition);
    const atBottom = isWebCamAtBottom(scene.finalWebcamPosition);
    const transX = currentLayout.width + getSafeSpace("square");
    const transY =
      canvasHeight - currentLayout.height - getSafeSpace("square") * 2;
    const previousAtBottom = isWebCamAtBottom(
      previousScene.finalWebcamPosition,
    );
    const changedVerticalPosition = atBottom !== previousAtBottom;

    const translateX = isWebcamLeft ? transX : -transX;
    const translateY = changedVerticalPosition
      ? atBottom
        ? -transY
        : transY
      : 0;

    return {
      ...scene.layout.subLayout,
      left: translateX,
      top: translateY,
    };
  }

  if (
    isGrowingFromMiniature({
      firstScene: previousScene,
      secondScene: scene,
    })
  ) {
    const heightDifference =
      scene.layout.webcamLayout.height -
      previousScene.layout.webcamLayout.height;

    const previouslyAtBottom = isWebCamAtBottom(
      previousScene.finalWebcamPosition,
    );
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
    isWebCamRight(previousScene.finalWebcamPosition) ===
    isWebCamRight(scene.finalWebcamPosition);
  const isSamePositionHorizontal =
    isWebCamAtBottom(previousScene.finalWebcamPosition) ===
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
