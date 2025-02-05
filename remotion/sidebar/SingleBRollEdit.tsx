import { updateDefaultProps } from "@remotion/studio";
import React, { useCallback } from "react";
import { useVideoConfig } from "remotion";
import { REGULAR_FONT } from "../../config/fonts";
import { BRollWithDimensions, SelectableVideoScene } from "../../config/scenes";
import { SceneTitle } from "./SceneTitle";

const container: React.CSSProperties = {
  ...REGULAR_FONT,
  fontSize: 20,
};

export const SingleBRollEdit: React.FC<{
  bRoll: BRollWithDimensions;
  bRollIndex: number;
  sceneIndex: number;
}> = ({ bRoll, bRollIndex, sceneIndex }) => {
  const sourceSplitted = bRoll.source.split("/");
  const { id } = useVideoConfig();

  const add1Sec = useCallback(() => {
    updateDefaultProps({
      compositionId: id,
      defaultProps: ({ unsavedDefaultProps }) => {
        const scenes = unsavedDefaultProps.scenes as SelectableVideoScene[];
        const scene = scenes[sceneIndex] as SelectableVideoScene;
        if (scene.type !== "videoscene") {
          throw new Error("Scene is not a video scene");
        }
        const newScene = {
          ...scene,
          bRolls: scene.bRolls.map((b) => {
            if (b.source !== bRoll.source) {
              return b;
            }

            return {
              ...b,
              from: b.from + 30,
            };
          }),
        };

        return {
          ...unsavedDefaultProps,
          scenes: [
            ...scenes.slice(0, sceneIndex),
            newScene,
            ...scenes.slice(sceneIndex + 1),
          ],
        };
      },
    });
  }, [bRoll.source, id, sceneIndex]);

  return (
    <div style={container}>
      <SceneTitle>BRoll {bRollIndex}</SceneTitle>
      <div>
        {decodeURIComponent(
          sourceSplitted[sourceSplitted.length - 1] as string,
        )}
      </div>
      <div>
        Start: {bRoll.from}
        <button onClick={add1Sec}>+1sec</button>
      </div>
      <div>Duration: {bRoll.durationInFrames} frames</div>
    </div>
  );
};
