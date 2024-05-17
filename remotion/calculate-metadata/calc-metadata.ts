import type { CalculateMetadataFunction } from "remotion";
import { FPS } from "../../config/fps";
import { type SceneAndMetadata } from "../../config/scenes";
import { SCENE_TRANSITION_DURATION } from "../../config/transitions";
import type { MainProps } from "../Main";
import {
  getShouldTransitionIn,
  getShouldTransitionOut,
} from "../animations/transitions";
import { getDimensionsForLayout } from "../layout/dimensions";
import { applyBRollRules } from "../scenes/BRoll/apply-b-roll-rules";
import { addMetadataToScene } from "./add-metadata-to-scene";
import { getAllCameras } from "./get-camera";

const PLACEHOLDER_DURATION_IN_FRAMES = 60;

export const calcMetadata: CalculateMetadataFunction<MainProps> = async ({
  props,
  compositionId,
}) => {
  const { hasAtLeast1Camera, scenesWithCameras } = getAllCameras({
    compositionId,
    scenes: props.scenes,
  });

  const scenesAndMetadataWithoutDuration = await Promise.all(
    scenesWithCameras.map(({ scene, cameras }) =>
      addMetadataToScene({
        scene,
        cameras,
        hasAtLeast1Camera,
        allScenes: props.scenes,
        canvasLayout: props.canvasLayout,
      }),
    ),
  );

  let addedUpDurations = 0;
  let currentChapter: string | null = null;

  const scenesAndMetadataWithDuration: SceneAndMetadata[] =
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

  if (scenesAndMetadataWithDuration.length === 0) {
    scenesAndMetadataWithDuration.push({
      type: "other-scene" as const,
      scene: {
        type: "noscenes" as const,
        music: "none",
        transitionToNextScene: true,
      },
      durationInFrames: PLACEHOLDER_DURATION_IN_FRAMES,
      from: 0,
    });
    addedUpDurations += PLACEHOLDER_DURATION_IN_FRAMES;
  }

  const { height, width } = getDimensionsForLayout(props.canvasLayout);

  return {
    durationInFrames: addedUpDurations,
    height,
    width,
    fps: FPS,
    props: {
      ...props,
      scenesAndMetadata: scenesAndMetadataWithDuration,
    },
  };
};
