import React from "react";

const style: React.CSSProperties = {
  fontSize: 30,
  color: "black",
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
};

export const SceneTitle: React.FC<{
  sceneIndex: number;
}> = ({ sceneIndex }) => {
  return <div style={style}>Scene {sceneIndex}</div>;
};
