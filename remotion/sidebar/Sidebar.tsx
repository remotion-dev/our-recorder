import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneAndMetadata } from "../../config/scenes";
import { Actions } from "../scenes/VideoScene/ActionOverlay/Actions";
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
      {currentScene && currentScene.type === "video-scene" ? (
        <Actions
          sceneIndex={currentSceneIndex}
          cameras={currentScene!.cameras}
        />
      ) : null}
    </AbsoluteFill>
  );
};
