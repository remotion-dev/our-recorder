import React from "react";
import { AbsoluteFill } from "remotion";

const container: React.CSSProperties = {
  justifyContent: "flex-end",
  alignItems: "center",
  fontSize: 48,
  paddingBottom: 50,
  pointerEvents: "none",
};

const inner: React.CSSProperties = {
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  padding: "12px 15px",
  color: "white",
  fontFamily: "Helvetica, Arial, sans-serif",
  pointerEvents: "unset",
  borderRadius: 10,
};

export const SrtPreviewLine: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <AbsoluteFill style={container}>
      <div style={inner}>{text}</div>
    </AbsoluteFill>
  );
};
