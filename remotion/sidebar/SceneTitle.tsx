import React from "react";

const style: React.CSSProperties = {
  fontSize: 30,
  color: "black",
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
  marginBottom: 20,
};

export const SceneTitle: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div style={style}>{children}</div>;
};
