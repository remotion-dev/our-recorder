import React, { useMemo } from "react";
import { AbsoluteFill, Img, OffthreadVideo } from "remotion";
import type { BRollWithDimensions } from "../../../config/scenes";
import type { Rect } from "../../layout/layout-types";

const blurStyle: React.CSSProperties = {
  position: "absolute",
  width: "110%",
  height: "110%",
  objectFit: "cover",
  filter: "blur(20px)",
  top: "-5%",
  left: "-5%",
};

export const Fade: React.FC<{
  appearProgress: number;
  disappearProgress: number;
  children: React.ReactNode;
}> = ({ appearProgress, disappearProgress, children }) => {
  const style: React.CSSProperties = useMemo(() => {
    return {
      opacity: appearProgress - disappearProgress,
    };
  }, [appearProgress, disappearProgress]);

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const FadeBRoll: React.FC<{
  bRoll: BRollWithDimensions;
  rect: Rect;
}> = ({ bRoll, rect }) => {
  const addBlurredAsset = rect.left > 0 || rect.top > 0;

  const style: React.CSSProperties = useMemo(() => {
    return {
      position: "absolute",
      objectFit: "cover",
      ...rect,
    };
  }, [rect]);

  if (bRoll.type === "image") {
    if (addBlurredAsset) {
      return (
        <>
          <Img src={bRoll.source} style={blurStyle} />
          <Img src={bRoll.source} style={style} />
        </>
      );
    }

    return <Img src={bRoll.source} style={style} />;
  }

  if (bRoll.type === "video") {
    if (addBlurredAsset) {
      return (
        <>
          <OffthreadVideo src={bRoll.source} muted style={blurStyle} />
          <OffthreadVideo src={bRoll.source} muted style={style} />
        </>
      );
    }

    return <OffthreadVideo src={bRoll.source} muted style={style} />;
  }

  throw new Error(`Invalid b-roll type ${bRoll.type}`);
};
