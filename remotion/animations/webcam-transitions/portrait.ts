import { VideoSceneAndMetadata } from "../../../config/scenes";
import { LayoutAndFade } from "../../layout/layout-types";

export const getPortraitWebcamStartOrEndLayout = ({
  currentScene,
}: {
  currentScene: VideoSceneAndMetadata;
}): LayoutAndFade => {
  if (!currentScene || currentScene.type !== "video-scene") {
    throw new Error("no transitions on non-video scenes");
  }
  return {
    layout: currentScene.layout.webcamLayout,
    shouldFadeRecording: false,
  };
};
