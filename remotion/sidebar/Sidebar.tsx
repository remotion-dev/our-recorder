import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneAndMetadata } from "../../config/scenes";
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
    </AbsoluteFill>
  );
};
