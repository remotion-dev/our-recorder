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
  totalDurationInFrames: number;
  scenesAndMetadataWithDuration: SceneAndMetadata[];
} => {
  let totalDurationInFrames = 0;

  const scenesAndMetadataWithDuration: SceneAndMetadata[] = scenes.map(
    (sceneAndMetadata, i) => {
      const previousSceneAndMetadata = scenes[i - 1] ?? null;
      const nextSceneAndMetadata = scenes[i + 1] ?? null;

      const isTransitioningIn = getShouldTransitionIn({
        previousSceneAndMetadata,
        sceneAndMetadata,
        canvasLayout,
      });
      const isTransitioningOut = getShouldTransitionOut({
        sceneAndMetadata,
        nextSceneAndMetadata,
        canvasLayout,
      });

      if (isTransitioningIn) {
        totalDurationInFrames -= SCENE_TRANSITION_DURATION;
      }

      const from = totalDurationInFrames;
      totalDurationInFrames += sceneAndMetadata.durationInFrames;

      if (sceneAndMetadata.type === "other-scene") {
        return {
          ...sceneAndMetadata,
          from,
        };
      }

      let sceneDuration = sceneAndMetadata.durationInFrames;

      let transitionAdjustedStartFrame = sceneAndMetadata.startFrame;

      if (isTransitioningIn) {
        transitionAdjustedStartFrame = Math.max(
          0,
          sceneAndMetadata.startFrame - SCENE_TRANSITION_DURATION,
        );

        const additionalTransitionFrames =
          sceneAndMetadata.startFrame - transitionAdjustedStartFrame;

        totalDurationInFrames += additionalTransitionFrames;
        sceneDuration += additionalTransitionFrames;
      }

      const retValue: SceneAndMetadata = {
        ...sceneAndMetadata,
        bRolls: applyBRollRules({
          bRolls: sceneAndMetadata.bRolls,
          sceneDurationInFrames: sceneDuration,
          willTransitionToNextScene: isTransitioningOut,
        }),
        startFrame: transitionAdjustedStartFrame,
        durationInFrames: sceneDuration,
        from,
      };

      return retValue;
    },
  );

  return addPlaceholderIfNoScenes({
    totalDurationInFrames: totalDurationInFrames,
    scenesAndMetadataWithDuration,
  });
};
