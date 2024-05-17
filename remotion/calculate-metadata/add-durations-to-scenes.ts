import { CanvasLayout } from "../../config/layout";
import { SceneAndMetadata } from "../../config/scenes";
import { SCENE_TRANSITION_DURATION } from "../../config/transitions";
import {
  getShouldTransitionIn,
  getShouldTransitionOut,
} from "../animations/transitions";
import { applyBRollRules } from "../scenes/BRoll/apply-b-roll-rules";
import { addPlaceholderIfNoScenes } from "./empty-place-holder";

export const addDurationsToScenes = (
  scenes: SceneAndMetadata[],
  canvasLayout: CanvasLayout,
): {
  durationInFrames: number;
  scenesAndMetadataWithDuration: SceneAndMetadata[];
} => {
  let addedUpDurations = 0;
  let currentChapter: string | null = null;

  const scenesAndMetadataWithDuration: SceneAndMetadata[] = scenes.map(
    (sceneAndMetadata, i) => {
      const previousSceneAndMetaData = scenes[i - 1] ?? null;
      const nextSceneAndMetaData = scenes[i + 1] ?? null;

      const isTransitioningIn = previousSceneAndMetaData
        ? getShouldTransitionIn({
            previousScene: previousSceneAndMetaData,
            scene: sceneAndMetadata,
            canvasLayout: canvasLayout,
          })
        : false;

      const isTransitioningOut = getShouldTransitionOut({
        sceneAndMetadata,
        nextScene: nextSceneAndMetaData,
        canvasLayout: canvasLayout,
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
    },
  );

  return addPlaceholderIfNoScenes({
    durationInFrames: addedUpDurations,
    scenesAndMetadataWithDuration,
  });
};
