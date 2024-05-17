import { getVideoMetadata } from "@remotion/media-utils";
import { CanvasLayout } from "../../config/layout";
import {
  Cameras,
  SceneAndMetadata,
  SceneVideos,
  SelectableScene,
} from "../../config/scenes";
import { postprocessSubtitles } from "../captions/processing/postprocess-subs";
import { getBRollDimensions } from "../layout/get-broll-dimensions";
import { getVideoSceneLayout } from "../layout/get-layout";
import { PLACEHOLDER_DURATION_IN_FRAMES } from "./empty-place-holder";
import { fetchWhisperCppOutput } from "./fetch-captions";
import { getFinalWebcamPosition } from "./get-final-webcam-position";
import { getStartEndFrame } from "./get-start-end-frame";

export const addMetadataToScene = async ({
  scene,
  cameras,
  hasAtLeast1Camera,
  allScenes,
  canvasLayout,
}: {
  scene: SelectableScene;
  cameras: Cameras | null;
  hasAtLeast1Camera: boolean;
  canvasLayout: CanvasLayout;
  allScenes: SelectableScene[];
}): Promise<SceneAndMetadata> => {
  if (scene.type !== "videoscene") {
    return {
      type: "other-scene",
      scene,
      durationInFrames: scene.durationInFrames,
      from: 0,
    };
  }

  if (!cameras) {
    return {
      type: "other-scene",
      scene: {
        type: hasAtLeast1Camera ? "nomorerecordings" : "norecordings",
        transitionToNextScene: scene.transitionToNextScene,
        music: scene.music,
      },
      durationInFrames: PLACEHOLDER_DURATION_IN_FRAMES,
      from: 0,
    };
  }

  const webcamMetadata = await getVideoMetadata(cameras.webcam.src);

  const displayMetadata = cameras.display
    ? await getVideoMetadata(cameras.display.src)
    : null;
  const subsJson = await fetchWhisperCppOutput(cameras.captions);

  // only interested in postprocessing of the words to get rid of "BLANK_WORDS"
  const subsForTimestamps = subsJson
    ? postprocessSubtitles({
        subTypes: subsJson,
        boxWidth: 200,
        canvasLayout: "landscape",
        fontSize: 10,
        maxLines: 3,
        subtitleType: "square",
      })
    : null;

  const { actualStartFrame, derivedEndFrame } = getStartEndFrame({
    scene,
    recordingDurationInSeconds: webcamMetadata.durationInSeconds,
    subsForTimestamps,
  });

  const durationInFrames = derivedEndFrame - actualStartFrame;

  const finalWebcamPosition = getFinalWebcamPosition({
    canvasLayout: canvasLayout,
    cameras: cameras,
    scenes: allScenes,
    webcamPosition: scene.webcamPosition,
    scene,
  });

  const bRollWithDimensions = await Promise.all(
    scene.bRolls.map((bRoll) => getBRollDimensions(bRoll)),
  );

  const videos: SceneVideos = {
    display: displayMetadata,
    webcam: webcamMetadata,
  };

  return {
    type: "video-scene",
    scene,
    videos,
    // Intentionally using ||
    // By default, Zod will give it a value of 0, which shifts the timeline
    durationInFrames: scene.duration || Math.round(durationInFrames),
    layout: getVideoSceneLayout({
      webcamPosition: finalWebcamPosition,
      videos,
      canvasLayout,
    }),
    cameras,
    finalWebcamPosition,
    from: 0,
    chapter: scene.newChapter ?? null,
    startFrame: actualStartFrame,
    endFrame: derivedEndFrame,
    bRolls: bRollWithDimensions,
  };
};
