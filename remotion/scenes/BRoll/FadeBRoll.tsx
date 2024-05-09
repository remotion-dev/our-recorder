import { useMemo } from "react";
import { Img, OffthreadVideo } from "remotion";
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

export const FadeBRoll: React.FC<{
  bRoll: BRollWithDimensions;
  appearProgress: number;
  disappearProgress: number;
  rect: Rect;
}> = ({ bRoll, appearProgress, disappearProgress, rect }) => {
  const addBlurredAsset = rect.left > 0 || rect.top > 0;

  const style: React.CSSProperties = useMemo(() => {
    return {
      position: "absolute",
      opacity: appearProgress - disappearProgress,
      objectFit: "cover",
      ...rect,
    };
  }, [appearProgress, rect, disappearProgress]);

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
