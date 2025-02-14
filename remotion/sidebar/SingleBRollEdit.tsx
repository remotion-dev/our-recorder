import { updateDefaultProps } from "@remotion/studio";
import React, { useCallback } from "react";
import { useVideoConfig } from "remotion";
import { REGULAR_FONT } from "../../config/fonts";
import {
  BRoll,
  BRollWithDimensions,
  SelectableVideoScene,
} from "../../config/scenes";
import { B_ROLL_TRANSITION_DURATION } from "../../config/transitions";
import { SceneTitle } from "./SceneTitle";

const container: React.CSSProperties = {
  ...REGULAR_FONT,
  fontSize: 24,
};

const increaseButton: React.CSSProperties = {
  fontSize: 25,
  appearance: "none",
  padding: "8px 12px",
  backgroundColor: "transparent",
  borderRadius: 16,
};

const controlsRow: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginTop: 24,
  marginBottom: 24,
};

const centerPiece: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
};

type BRollUpdater = (b: BRoll) => BRoll;

export const SingleBRollEdit: React.FC<{
  bRoll: BRollWithDimensions;
  bRollIndex: number;
  sceneIndex: number;
}> = ({ bRoll, bRollIndex, sceneIndex }) => {
  const sourceSplitted = bRoll.source.split("/");
  const { id, fps } = useVideoConfig();

  const updateBRoll = useCallback(
    (updater: BRollUpdater) => {
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

              return updater(b);
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
    },
    [bRoll.source, id, sceneIndex],
  );

  const minus1Sec = useCallback(() => {
    updateBRoll((b) => {
      return {
        ...b,
        from: Math.max(0, b.from - fps),
      };
    });
  }, [fps, updateBRoll]);

  const add1Sec = useCallback(() => {
    updateBRoll((b) => {
      return {
        ...b,
        from: b.from + fps,
      };
    });
  }, [fps, updateBRoll]);

  const durationMin1s = useCallback(() => {
    updateBRoll((b) => {
      return {
        ...b,
        durationInFrames: Math.max(
          B_ROLL_TRANSITION_DURATION * 2,
          b.durationInFrames - fps,
        ),
      };
    });
  }, [fps, updateBRoll]);

  const durationPlus1s = useCallback(() => {
    updateBRoll((b) => {
      return {
        ...b,
        durationInFrames: b.durationInFrames + fps,
      };
    });
  }, [fps, updateBRoll]);

  return (
    <div style={container}>
      <SceneTitle>BRoll {bRollIndex}</SceneTitle>
      <div>
        {decodeURIComponent(
          sourceSplitted[sourceSplitted.length - 1] as string,
        )}
      </div>
      <div style={controlsRow}>
        <button style={increaseButton} onClick={minus1Sec}>
          -1s
        </button>
        <div style={centerPiece}>
          <div>Start</div>
          <div>{(bRoll.from / fps).toFixed(2)}s</div>
        </div>
        <button style={increaseButton} onClick={add1Sec}>
          +1s
        </button>
      </div>
      <div style={controlsRow}>
        <button style={increaseButton} onClick={durationMin1s}>
          -1s
        </button>
        <div style={centerPiece}>
          <div>Duration</div>
          <div>{(bRoll.durationInFrames / fps).toFixed(2)}s</div>
        </div>
        <button style={increaseButton} onClick={durationPlus1s}>
          +1s
        </button>
      </div>
    </div>
  );
};
