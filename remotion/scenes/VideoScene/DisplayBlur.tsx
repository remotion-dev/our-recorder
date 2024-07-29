import React from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { Rect } from "../../layout/layout-types";

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
          width: dimensions.width + 40,
          height: dimensions.height + 40,
          top: dimensions.top - 20,
          left: dimensions.left - 20,
          position: "absolute",
          objectFit: "cover",
          filter: "blur(20px)",
          opacity: 0.5,
        }}
        src={src}
      ></OffthreadVideo>
    </AbsoluteFill>
  );
};
