import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneAndMetadata } from "../../config/scenes";
import { SceneTitle } from "./SceneTitle";

const style: React.CSSProperties = {
  padding: 20,
  backgroundColor: "#eee",
};

export const Sidebar: React.FC<{
  scenesAndMetadata: SceneAndMetadata[];
}> = ({ scenesAndMetadata }) => {
  const frame = useCurrentFrame();
  const currentScene = scenesAndMetadata.findLastIndex((scene) => {
    return frame >= scene.from;
  });

  return (
    <AbsoluteFill style={style}>
      <SceneTitle sceneIndex={currentScene} />
    </AbsoluteFill>
  );
};
