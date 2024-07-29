import React from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { Rect } from "../../layout/layout-types";

const OVERSCAN = 20;

export const DisplayBlur: React.FC<{
  src: string;
  dimensions: Rect;
}> = ({ src, dimensions }) => {
  return (
    <AbsoluteFill
      style={{
        background: "black",
      }}
    >
      <OffthreadVideo
        style={{
          width: dimensions.width + OVERSCAN * 2,
          height: dimensions.height + OVERSCAN * 2,
          top: dimensions.top - OVERSCAN,
          left: dimensions.left - OVERSCAN,
          position: "absolute",
          objectFit: "cover",
          filter: `blur(${OVERSCAN}px)`,
          opacity: 0.5,
        }}
        src={src}
      />
    </AbsoluteFill>
  );
};
