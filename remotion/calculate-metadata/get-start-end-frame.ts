import { FPS } from "../../config/fps";
import { SelectableVideoScene } from "../../config/scenes";
import { SubTypes } from "../captions/types";

const START_FRAME_PADDING = Math.ceil(FPS / 4);
const END_FRAME_PADDING = FPS / 2;

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

export const getStartEndFrame = ({
  scene,
  recordingDurationInSeconds,
  subsForTimestamps,
}: {
  scene: SelectableVideoScene;
  recordingDurationInSeconds: number;
  subsForTimestamps: SubTypes | null;
}) => {
  const endFrameFromSubs = deriveEndFrameFromSubs(subsForTimestamps);
  const derivedEndFrame = getClampedEndFrame({
    durationInSeconds: recordingDurationInSeconds,
    derivedEndFrame: endFrameFromSubs,
  });

  const startFrameFromSubs = deriveStartFrameFromSubsJSON(subsForTimestamps);
  const actualStartFrame = getClampedStartFrame({
    startOffset: scene.startOffset,
    startFrameFromSubs,
    derivedEndFrame,
  });

  return { actualStartFrame, derivedEndFrame };
};
