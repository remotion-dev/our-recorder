import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TITLE_FONT } from "../../config/fonts";
import { SceneAndMetadata } from "../../config/scenes";
import { COLORS } from "../../config/themes";
import { DeleteRecordingAction } from "../scenes/VideoScene/ActionOverlay/DeleteRecordingAction";
import { EditCaptionsAction } from "../scenes/VideoScene/ActionOverlay/EditCaptionsAction";
import {
  NextSceneAction,
  PreviousSceneAction,
} from "../scenes/VideoScene/ActionOverlay/PreviousNextSceneAction";
import { SceneTitle } from "./SceneTitle";

const style: React.CSSProperties = {
  padding: 30,
  backgroundColor: "#eee",
};

const DragToAddBRoll: React.FC = () => {
  const style: React.CSSProperties = useMemo(() => {
    return {
      ...TITLE_FONT,
      fontSize: 20,
      color: COLORS.light.WORD_COLOR_ON_BG_GREYED,
      marginTop: 40,
    };
  }, []);

  return <div style={style}>Drag assets to add B-Rolls</div>;
};

export const Sidebar: React.FC<{
  scenesAndMetadata: SceneAndMetadata[];
}> = ({ scenesAndMetadata }) => {
  const frame = useCurrentFrame();
  const currentSceneIndex = scenesAndMetadata.findLastIndex((scene) => {
    return frame >= scene.from;
  });
  const currentScene = scenesAndMetadata[currentSceneIndex];
  if (!currentScene) {
    throw new Error("No current scene");
  }

  return (
    <AbsoluteFill style={style}>
      <SceneTitle sceneIndex={currentSceneIndex} />
      <PreviousSceneAction
        currentSceneIndex={currentSceneIndex}
        scenesAndMetadata={scenesAndMetadata}
      />
      <NextSceneAction
        currentSceneIndex={currentSceneIndex}
        scenesAndMetadata={scenesAndMetadata}
      />
      {currentScene.type === "video-scene" ? (
        <EditCaptionsAction currentScene={currentScene} />
      ) : null}
      {currentScene.type === "video-scene" ? (
        <DeleteRecordingAction
          sceneIndex={currentSceneIndex}
          cameras={currentScene.cameras}
        />
      ) : null}
      <DragToAddBRoll />
    </AbsoluteFill>
  );
};
