import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
} from "../webcam-transitions/helpers";

export const belowVideoSubtitleEnter = ({
  previousScene,
  scene,
}: {
  previousScene: SceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
}): Layout => {
  if (previousScene === null) {
    return scene.layout.subLayout;
  }

  if (previousScene.type !== "video-scene") {
    return {
      ...scene.layout.subLayout,
      top: scene.layout.subLayout.top + 500,
    };
  }

  if (
    isShrinkingToMiniature({ firstScene: previousScene, secondScene: scene })
  ) {
    return {
      ...scene.layout.subLayout,
      top: scene.layout.subLayout.top + 500,
    };
  }

  return scene.layout.subLayout;
};

export const belowVideoSubtitleExit = ({
  nextScene,
  currentScene,
}: {
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
}): Layout => {
  if (!nextScene) {
    return currentScene.layout.subLayout;
  }

  if (nextScene.type !== "video-scene") {
    return {
      ...currentScene.layout.subLayout,
      top: currentScene.layout.subLayout.top + 500,
    };
  }

  if (
    isGrowingFromMiniature({
      firstScene: currentScene,
      secondScene: nextScene,
    })
  ) {
    return {
      ...currentScene.layout.subLayout,
      top: currentScene.layout.subLayout.top + 500,
    };
  }

  return currentScene.layout.subLayout;
};
