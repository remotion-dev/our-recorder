import { VideoSceneAndMetadata } from "../../../config/scenes";
import { LayoutAndFade } from "../../layout/layout-types";

export const getPortraitDisplayEnterOrExit = ({
  currentScene,
}: {
  currentScene: VideoSceneAndMetadata;
}): LayoutAndFade => {
  if (
    currentScene.type !== "video-scene" ||
    currentScene.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  return {
    layout: currentScene.layout.displayLayout,
    shouldFadeRecording: false,
  };
};
