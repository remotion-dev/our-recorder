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
  let durationInFrames = 0;

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
        durationInFrames -= SCENE_TRANSITION_DURATION;
      }

      const from = durationInFrames;
      durationInFrames += sceneAndMetadata.durationInFrames;

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

        durationInFrames += additionalTransitionFrames;
        adjustedDuration += additionalTransitionFrames;
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
      };

      return retValue;
    },
  );

  return addPlaceholderIfNoScenes({
    durationInFrames: durationInFrames,
    scenesAndMetadataWithDuration,
  });
};
