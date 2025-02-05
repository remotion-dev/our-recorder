import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneAndMetadata } from "../../config/scenes";
import { DeleteRecordingAction } from "../scenes/VideoScene/ActionOverlay/DeleteRecordingAction";
import {
  NextSceneAction,
  PreviousSceneAction,
} from "../scenes/VideoScene/ActionOverlay/NextSceneAction";
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
      {currentScene && currentScene.type === "video-scene" ? (
        <DeleteRecordingAction
          sceneIndex={currentSceneIndex}
          cameras={currentScene.cameras}
        />
      ) : null}
    </AbsoluteFill>
  );
};
