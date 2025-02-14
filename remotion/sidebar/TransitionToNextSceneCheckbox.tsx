import { updateDefaultProps } from "@remotion/studio";
import { useCallback } from "react";
import { useVideoConfig } from "remotion";
import { SceneAndMetadata, SelectableVideoScene } from "../../config/scenes";
import { ActionContainer } from "./Action";

export const TransitionToNextSceneCheckbox: React.FC<{
  currentSceneIndex: number;
  scenesAndMetadata: SceneAndMetadata[];
}> = ({ currentSceneIndex, scenesAndMetadata }) => {
  const { id } = useVideoConfig();
  const next = scenesAndMetadata[currentSceneIndex + 1];

  const scene = scenesAndMetadata[currentSceneIndex];
  if (!scene || scene.type !== "video-scene") {
    throw new Error("No current scene");
  }

  const toggle = useCallback(() => {
    updateDefaultProps({
      compositionId: id,
      defaultProps: ({ unsavedDefaultProps }) => {
        const scenes = unsavedDefaultProps.scenes as SelectableVideoScene[];
        const sceneAndMetadata = scenes[
          currentSceneIndex
        ] as SelectableVideoScene;
        if (sceneAndMetadata.type !== "videoscene") {
          throw new Error("Scene is not a video scene");
        }
        const newScene: SelectableVideoScene = {
          ...sceneAndMetadata,
          transitionToNextScene: !sceneAndMetadata.transitionToNextScene,
        };

        return {
          ...unsavedDefaultProps,
          scenes: [
            ...scenes.slice(0, currentSceneIndex),
            newScene,
            ...scenes.slice(currentSceneIndex + 1),
          ],
        };
      },
    });
  }, [currentSceneIndex, id]);

  return (
    <ActionContainer disabled={!next} onClick={toggle}>
      {scene.scene.transitionToNextScene ? (
        <svg
          style={{
            height: 24,
          }}
          viewBox="0 0 448 512"
        >
          <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
        </svg>
      ) : (
        <svg
          style={{
            height: 24,
          }}
          viewBox="0 0 448 512"
        >
          <path d="M88 32l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L88 80c-22.1 0-40 17.9-40 40l0 16c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-16C0 71.4 39.4 32 88 32zM24 192c13.3 0 24 10.7 24 24l0 80c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-80c0-13.3 10.7-24 24-24zm400 0c13.3 0 24 10.7 24 24l0 80c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-80c0-13.3 10.7-24 24-24zm0-32c-13.3 0-24-10.7-24-24l0-16c0-22.1-17.9-40-40-40l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l16 0c48.6 0 88 39.4 88 88l0 16c0 13.3-10.7 24-24 24zm24 216l0 16c0 48.6-39.4 88-88 88l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l16 0c22.1 0 40-17.9 40-40l0-16c0-13.3 10.7-24 24-24s24 10.7 24 24zM48 376l0 16c0 22.1 17.9 40 40 40l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-48.6 0-88-39.4-88-88l0-16c0-13.3 10.7-24 24-24s24 10.7 24 24zM184 480c-13.3 0-24-10.7-24-24s10.7-24 24-24l80 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0zM160 56c0-13.3 10.7-24 24-24l80 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24z" />
        </svg>
      )}

      <label>Transition to next scene</label>
    </ActionContainer>
  );
};
