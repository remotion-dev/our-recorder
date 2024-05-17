import type { CalculateMetadataFunction } from "remotion";
import { waitForFonts } from "../../config/fonts";
import { FPS } from "../../config/fps";
import {
  Cameras,
  SelectableScene,
  type SceneAndMetadata,
} from "../../config/scenes";
import { SCENE_TRANSITION_DURATION } from "../../config/transitions";
import type { MainProps } from "../Main";
import {
  getShouldTransitionIn,
  getShouldTransitionOut,
} from "../animations/transitions";
import { getDimensionsForLayout } from "../layout/dimensions";
import { applyBRollRules } from "../scenes/BRoll/apply-b-roll-rules";
import { getCameras } from "./get-camera";
import { mapScene } from "./map-scene";

const PLACE_HOLDER_DURATION_IN_FRAMES = 60;

type CamerasAndScene = {
  scene: SelectableScene;
  cameras: Cameras | null;
};

export const calcMetadata: CalculateMetadataFunction<MainProps> = async ({
  props,
  compositionId,
}) => {
  const allCameras = getCameras(compositionId);
  let videoIndex = -1;

  const camerasForScene = props.scenes.map((scene): CamerasAndScene => {
    if (scene.type !== "videoscene") {
      return { cameras: null, scene };
    }

    videoIndex += 1;
    return { scene, cameras: allCameras[videoIndex] as Cameras };
  });

  const scenesAndMetadataWithoutDuration = await Promise.all(
    camerasForScene.map(
      async ({ scene, cameras }): Promise<SceneAndMetadata> => {
        if (scene.type !== "videoscene") {
          return {
            type: "other-scene",
            scene,
            durationInFrames: scene.durationInFrames,
            from: 0,
          };
        }

        return mapScene({
          scene,
          cameras,
          videoIndex,
          allScenes: props.scenes,
          canvasLayout: props.canvasLayout,
        });
      },
    ),
  );

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
