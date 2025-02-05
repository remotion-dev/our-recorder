import { seek } from "@remotion/studio";
import { useCallback } from "react";
import { SceneAndMetadata } from "../../config/scenes";
import { ActionContainer } from "./Action";

export const NextSceneAction: React.FC<{
  scenesAndMetadata: SceneAndMetadata[];
  currentSceneIndex: number;
}> = ({ scenesAndMetadata, currentSceneIndex }) => {
  const next = scenesAndMetadata[currentSceneIndex + 1];
  const onClick = useCallback(() => {
    if (!next) {
      return;
    }

    // TODO: Will work in next Remotion version
    seek(next.from);
  }, [next]);

  return (
    <ActionContainer disabled={!next} onClick={onClick}>
      <svg
        style={{
          height: 24,
        }}
        viewBox="0 0 448 512"
      >
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
      </svg>
      <div>Next scene</div>
    </ActionContainer>
  );
};

export const PreviousSceneAction: React.FC<{
  scenesAndMetadata: SceneAndMetadata[];
  currentSceneIndex: number;
}> = ({ scenesAndMetadata, currentSceneIndex }) => {
  const next = scenesAndMetadata[currentSceneIndex - 1];
  const onClick = useCallback(() => {
    if (!next) {
      return;
    }

    // TODO: Will work in next Remotion version
    seek(next.from);
  }, [next]);

  return (
    <ActionContainer disabled={!next} onClick={onClick}>
      <svg
        style={{
          height: 24,
        }}
        viewBox="0 0 448 512"
      >
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
      </svg>
      <div>Previous scene</div>
    </ActionContainer>
  );
};
