import { getVideoMetadata } from "@remotion/media-utils";
import { StaticFile } from "remotion";
import { FPS } from "../../config/fps";
import { CanvasLayout } from "../../config/layout";
import {
  Cameras,
  SceneAndMetadata,
  SceneVideos,
  SelectableScene,
  WebcamPosition,
} from "../../config/scenes";
import { postprocessSubtitles } from "../captions/processing/postprocess-subs";
import { SubTypes, WhisperOutput } from "../captions/types";
import { getBRollDimensions } from "../layout/get-broll-dimensions";
import { getVideoSceneLayout } from "../layout/get-layout";
import { getFinalWebcamPosition } from "./get-final-webcam-position";

export const PLACE_HOLDER_DURATION_IN_FRAMES = 60;

const START_FRAME_PADDING = Math.ceil(FPS / 4);
const END_FRAME_PADDING = FPS / 2;

const deriveStartFrameFromSubsJSON = (subsJSON: SubTypes | null): number => {
  if (!subsJSON) {
    return 0;
  }

  // taking the first real word and take its start timestamp in ms.
  const startFromInHundrethsOfSec =
    subsJSON.segments[0]?.words[0]?.firstTimestamp;
  if (startFromInHundrethsOfSec === undefined) {
    return 0;
  }

  const startFromInFrames =
    Math.floor((startFromInHundrethsOfSec / 1000) * FPS) - START_FRAME_PADDING;
  return startFromInFrames > 0 ? startFromInFrames : 0;
};

const getClampedStartFrame = ({
  startOffset,
  startFrameFromSubs,
  derivedEndFrame,
}: {
  startOffset: number;
  startFrameFromSubs: number;
  derivedEndFrame: number;
}): number => {
  const combinedStartFrame = startFrameFromSubs + startOffset;

  if (combinedStartFrame > derivedEndFrame) {
    return derivedEndFrame;
  }

  if (combinedStartFrame < 0) {
    return 0;
  }

  return combinedStartFrame;
};

const getClampedEndFrame = ({
  durationInSeconds,
  derivedEndFrame,
}: {
  durationInSeconds: number;
  derivedEndFrame: number | null;
}): number => {
  const videoDurationInFrames = Math.floor(durationInSeconds * FPS);
  if (!derivedEndFrame) {
    return videoDurationInFrames;
  }

  const paddedEndFrame = derivedEndFrame + END_FRAME_PADDING;
  if (paddedEndFrame > videoDurationInFrames) {
    return videoDurationInFrames;
  }

  return paddedEndFrame;
};

const deriveEndFrameFromSubs = (subs: SubTypes | null) => {
  if (!subs) {
    return null;
  }

  const lastSegment = subs.segments[subs.segments.length - 1];
  const lastWord = lastSegment?.words[lastSegment.words.length - 1];
  if (!lastWord || !lastWord.lastTimestamp) {
    throw new Error("Last word or its timestampe is undefined");
  }

  const lastFrame = Math.floor((lastWord.lastTimestamp / 1000) * FPS);
  return lastFrame;
};

const fetchSubsJson = async (
  file: StaticFile | null,
): Promise<WhisperOutput | null> => {
  if (!file) {
    return null;
  }

  try {
    const res = await fetch(file.src);
    const data = await res.json();
    return data as WhisperOutput;
  } catch (error) {
    console.error("Error fetching WhisperOutput from JSON:", error);
    return null;
  }
};

export const mapScene = async ({
  scene,
  cameras,
  videoIndex,
  allScenes,
  canvasLayout,
}: {
  scene: SelectableScene;
  cameras: Cameras | null;
  videoIndex: number;
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
        type: videoIndex > 0 ? "nomorerecordings" : "norecordings",
        transitionToNextScene: scene.transitionToNextScene,
        music: scene.music,
      },
      durationInFrames: PLACE_HOLDER_DURATION_IN_FRAMES,
      from: 0,
    };
  }

  const {
    durationInSeconds,
    height: webcamHeight,
    width: webcamWidth,
  } = await getVideoMetadata(cameras.webcam.src);

  const dim = cameras.display
    ? await getVideoMetadata(cameras.display.src)
    : null;
  const subsJson = await fetchSubsJson(cameras.subs);

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

  const endFrameFromSubs = deriveEndFrameFromSubs(subsForTimestamps);

  const derivedEndFrame = getClampedEndFrame({
    durationInSeconds,
    derivedEndFrame: endFrameFromSubs,
  });

  const startFrameFromSubs = deriveStartFrameFromSubsJSON(subsForTimestamps);
  const actualStartFrame = getClampedStartFrame({
    startOffset: scene.startOffset,
    startFrameFromSubs,
    derivedEndFrame,
  });

  const durationInFrames =
    durationInSeconds === Infinity
      ? PLACE_HOLDER_DURATION_IN_FRAMES
      : derivedEndFrame - actualStartFrame;

  const webcamPosition = getFinalWebcamPosition({
    canvasLayout: canvasLayout,
    cameras: cameras,
    scenes: allScenes,
    webcamPosition: scene.webcamPosition,
    scene,
  });

  const bRollWithDimensions = await Promise.all(
    scene.bRolls.map((bRoll) => {
      return getBRollDimensions(bRoll);
    }),
  );

  const videos: SceneVideos = {
    display: dim,
    webcam: {
      height: webcamHeight,
      width: webcamWidth,
    },
  };

  return {
    type: "video-scene",
    scene,
    videos,
    // Intentionally using ||
    // By default, Zod will give it a value of 0, which shifts the timeline
    durationInFrames: scene.duration || Math.round(durationInFrames),
    layout: getVideoSceneLayout({
      webcamPosition: webcamPosition as WebcamPosition,
      videos,
      canvasLayout: canvasLayout,
    }),
    cameras: cameras,
    finalWebcamPosition: webcamPosition as WebcamPosition,
    from: 0,
    chapter: scene.newChapter ?? null,
    startFrame: actualStartFrame,
    endFrame: derivedEndFrame,
    bRolls: bRollWithDimensions,
  };
};
