import React, { useMemo } from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { Rect } from "../../layout/layout-types";

const OVERSCAN = 20;

export const DisplayBlur: React.FC<{
  src: string;
  dimensions: Rect;
}> = ({ src, dimensions }) => {
  const containerStyle: React.CSSProperties = useMemo(() => {
    return {
      background: "black",
    };
  }, []);

  const style: React.CSSProperties = useMemo(() => {
    return {
      width: dimensions.width + OVERSCAN * 2,
      height: dimensions.height + OVERSCAN * 2,
      top: dimensions.top - OVERSCAN,
      left: dimensions.left - OVERSCAN,
      position: "absolute",
      objectFit: "cover",
      filter: `blur(${OVERSCAN}px)`,
      opacity: 0.5,
    };
  }, [dimensions]);

  return (
    <AbsoluteFill style={containerStyle}>
      <OffthreadVideo style={style} src={src} />
    </AbsoluteFill>
  );
};
