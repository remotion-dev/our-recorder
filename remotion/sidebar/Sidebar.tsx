import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneAndMetadata } from "../../config/scenes";
import { BRollEditor } from "./BRollEditor";
import { DeleteRecordingAction } from "./DeleteRecordingAction";
import { EditCaptionsAction } from "./EditCaptionsAction";
import {
  NextSceneAction,
  PreviousSceneAction,
} from "./PreviousNextSceneAction";
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
      <SceneTitle>Scene {currentSceneIndex}</SceneTitle>
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
      {currentScene.type === "video-scene" ? (
        <BRollEditor sceneIndex={currentSceneIndex} scene={currentScene} />
      ) : null}
    </AbsoluteFill>
  );
};
