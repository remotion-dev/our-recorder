import type { CalculateMetadataFunction, StaticFile } from "remotion";
import { getStaticFiles } from "remotion";
import {
  ALTERNATIVE1_PREFIX,
  ALTERNATIVE2_PREFIX,
  DISPLAY_PREFIX,
  SUBS_PREFIX,
  WEBCAM_PREFIX,
} from "../../config/cameras";
import { waitForFonts } from "../../config/fonts";
import { FPS } from "../../config/fps";
import { type Cameras, type SceneAndMetadata } from "../../config/scenes";
import { SCENE_TRANSITION_DURATION } from "../../config/transitions";
import type { MainProps } from "../Main";
import {
  getShouldTransitionIn,
  getShouldTransitionOut,
} from "../animations/transitions";
import { truthy } from "../helpers/truthy";
import { getDimensionsForLayout } from "../layout/dimensions";
import { applyBRollRules } from "../scenes/BRoll/apply-b-roll-rules";
import { mapScene } from "./map-scene";

const getCameras = (prefix: string) => {
  const files = getStaticFiles().filter((f) => f.name.startsWith(prefix));

  const mapFile = (file: StaticFile): Cameras | null => {
    if (!file.name.startsWith(`${prefix}/${WEBCAM_PREFIX}`)) {
      return null;
    }

    const timestamp = file.name
      .toLowerCase()
      .replace(`${prefix}/${WEBCAM_PREFIX}`, "")
      .replace(".webm", "")
      .replace(".mov", "")
      .replace(".mp4", "");

    const display = files.find((_f) =>
      _f.name.startsWith(`${prefix}/${DISPLAY_PREFIX}${timestamp}.`),
    );
    const sub = files.find((_f) =>
      _f.name.startsWith(`${prefix}/${SUBS_PREFIX}${timestamp}.`),
    );
    const alternative1 = files.find((_f) =>
      _f.name.startsWith(`${prefix}/${ALTERNATIVE1_PREFIX}${timestamp}.`),
    );
    const alternative2 = files.find((_f) =>
      _f.name.startsWith(`${prefix}/${ALTERNATIVE2_PREFIX}${timestamp}.`),
    );

    return {
      webcam: file,
      display: display ?? null,
      subs: sub ?? null,
      alternative1: alternative1 ?? null,
      alternative2: alternative2 ?? null,
      timestamp: parseInt(timestamp, 10),
    };
  };

  return files
    .map(mapFile)
    .filter(truthy)
    .sort((a, b) => a.timestamp - b.timestamp);
};

const PLACE_HOLDER_DURATION_IN_FRAMES = 60;

export const calcMetadata: CalculateMetadataFunction<MainProps> = async ({
  props,
  compositionId,
}) => {
  const cameras = getCameras(compositionId);
  let videoIndex = -1;

  const camerasForScene = props.scenes.map((scene) => {
    if (scene.type !== "videoscene") {
      return null;
    }

    videoIndex += 1;
    return cameras[videoIndex];
  });

  const scenesAndMetadataWithoutDuration = (
    await Promise.all(
      props.scenes.map(async (scene, i): Promise<SceneAndMetadata | null> => {
        if (scene.type !== "videoscene") {
          return {
            type: "other-scene",
            scene,
            durationInFrames: scene.durationInFrames,
            from: 0,
          };
        }

        const cameras = camerasForScene[i] ?? null;

        return mapScene({
          scene,
          cameras,
          videoIndex,
          allScenes: props.scenes,
          canvasLayout: props.canvasLayout,
        });
      }),
    )
  ).filter(truthy);

  let addedUpDurations = 0;
  let currentChapter: string | null = null;

  await waitForFonts();

  const scenesAndMetadata: SceneAndMetadata[] =
    scenesAndMetadataWithoutDuration.map((sceneAndMetadata, i) => {
      const previousSceneAndMetaData =
        scenesAndMetadataWithoutDuration[i - 1] ?? null;
      const nextSceneAndMetaData =
        scenesAndMetadataWithoutDuration[i + 1] ?? null;

      const isTransitioningIn = previousSceneAndMetaData
        ? getShouldTransitionIn({
            previousScene: previousSceneAndMetaData,
            scene: sceneAndMetadata,
            canvasLayout: props.canvasLayout,
          })
        : false;

      const isTransitioningOut = getShouldTransitionOut({
        sceneAndMetadata,
        nextScene: nextSceneAndMetaData,
        canvasLayout: props.canvasLayout,
      });

      if (isTransitioningIn) {
        addedUpDurations -= SCENE_TRANSITION_DURATION;
      }

      const from = addedUpDurations;
      addedUpDurations += sceneAndMetadata.durationInFrames;

      if (sceneAndMetadata.type === "other-scene") {
        return {
          ...sceneAndMetadata,
          from,
        };
      }

      let adjustedDuration = sceneAndMetadata.durationInFrames;

      let transitionAdjustedStartFrame = sceneAndMetadata.startFrame;

      if (isTransitioningIn) {
        transitionAdjustedStartFrame = Math.max(
          0,
          sceneAndMetadata.startFrame - SCENE_TRANSITION_DURATION,
        );

        const additionalTransitionFrames =
          sceneAndMetadata.startFrame - transitionAdjustedStartFrame;

        addedUpDurations += additionalTransitionFrames;
        adjustedDuration += additionalTransitionFrames;
      }

      if (sceneAndMetadata.scene.newChapter) {
        currentChapter = sceneAndMetadata.scene.newChapter;
      }

      const retValue: SceneAndMetadata = {
        ...sceneAndMetadata,
        bRolls: applyBRollRules({
          bRolls: sceneAndMetadata.bRolls,
          sceneDurationInFrames: adjustedDuration,
          willTransitionToNextScene: isTransitioningOut,
        }),
        startFrame: transitionAdjustedStartFrame,
        durationInFrames: adjustedDuration,
        from,
        chapter: currentChapter,
      };

      if (sceneAndMetadata.scene.stopChapteringAfterThis) {
        currentChapter = null;
      }

      return retValue;
    });

  if (scenesAndMetadata.length === 0) {
    scenesAndMetadata.push({
      type: "other-scene" as const,
      scene: {
        type: "noscenes" as const,
        music: "none",
        transitionToNextScene: true,
      },
      durationInFrames: PLACE_HOLDER_DURATION_IN_FRAMES,
      from: 0,
    });
    addedUpDurations += PLACE_HOLDER_DURATION_IN_FRAMES;
  }

  const { height, width } = getDimensionsForLayout(props.canvasLayout);

  return {
    durationInFrames: addedUpDurations,
    height,
    width,
    fps: FPS,
    props: {
      ...props,
      scenesAndMetadata,
    },
  };
};
