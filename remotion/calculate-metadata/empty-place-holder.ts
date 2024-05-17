import { SceneAndMetadata } from "../../config/scenes";

const PLACEHOLDER_DURATION_IN_FRAMES = 60;

export const addPlaceholderIfNoScenes = ({
  durationInFrames,
  scenesAndMetadataWithDuration,
}: {
  durationInFrames: number;
  scenesAndMetadataWithDuration: SceneAndMetadata[];
}): {
  durationInFrames: number;
  scenesAndMetadataWithDuration: SceneAndMetadata[];
} => {
  if (scenesAndMetadataWithDuration.length > 0) {
    return { scenesAndMetadataWithDuration, durationInFrames };
  }

  return {
    scenesAndMetadataWithDuration: [
      {
        type: "other-scene" as const,
        scene: {
          type: "noscenes" as const,
          music: "none",
          transitionToNextScene: true,
        },
        durationInFrames: PLACEHOLDER_DURATION_IN_FRAMES,
        from: 0,
      },
    ],
    durationInFrames,
  };
};
