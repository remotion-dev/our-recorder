import React, { useMemo } from "react";
import {
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type { BRollWithDimensions } from "../../../config/scenes";
import { B_ROLL_TRANSITION_DURATION } from "../../../config/transitions";
import { fitElementSizeInContainer } from "../../layout/fit-element";
import type {
  BRollEnterDirection,
  Layout,
  Rect,
} from "../../layout/layout-types";
import { ScaleDownIfBRollRequiresIt } from "./ScaleDownWithBRoll";

const FadeBRoll: React.FC<{
  bRoll: BRollWithDimensions;
  appearProgress: number;
  disappearProgress: number;
  rect: Rect;
}> = ({ bRoll, appearProgress, disappearProgress, rect }) => {
  const style: React.CSSProperties = useMemo(() => {
    return {
      position: "absolute",
      opacity: appearProgress - disappearProgress,
      objectFit: "cover",
      ...rect,
    };
  }, [appearProgress, rect, disappearProgress]);

  if (bRoll.type === "image") {
    return <Img src={bRoll.source} style={style} />;
  }

  if (bRoll.type === "video") {
    return <OffthreadVideo src={bRoll.source} muted style={style} />;
  }

  throw new Error(`Invalid b-roll type ${bRoll.type}`);
};

const InnerBRoll: React.FC<{
  bRoll: BRollWithDimensions;
  bRollsBefore: BRollWithDimensions[];
  bRollEnterDirection: BRollEnterDirection;
  bRollLayout: Layout;
  sceneFrame: number;
  canvasLayout: CanvasLayout;
}> = ({
  bRoll,
  bRollsBefore,
  bRollLayout,
  bRollEnterDirection,
  sceneFrame,
  canvasLayout,
}) => {
  const { fps, height: canvasHeight } = useVideoConfig();
  const frame = useCurrentFrame();

  const bRollType = canvasLayout === "landscape" ? "fade" : "scale";

  const appearProgress = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: B_ROLL_TRANSITION_DURATION,
  });

  const disappearProgress = spring({
    fps,
    frame,
    delay: bRoll.durationInFrames - B_ROLL_TRANSITION_DURATION,
    config: {
      damping: 200,
    },
    durationInFrames: B_ROLL_TRANSITION_DURATION,
  });
  const bRollContainer: Layout = useMemo(() => {
    return {
      ...bRollLayout,
      display: "flex",
    };
  }, [bRollLayout]);

  const enterPosition = useMemo(() => {
    if (bRollEnterDirection === "top") {
      return -bRollLayout.height;
    }

    if (bRollEnterDirection === "bottom") {
      return canvasHeight;
    }

    throw new Error(`Invalid direction ${bRollEnterDirection}`);
  }, [bRollEnterDirection, bRollLayout.height, canvasHeight]);

  const topOffset = interpolate(
    appearProgress - disappearProgress,
    [0, 1],
    [enterPosition, bRollLayout.top],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const outerStyle: React.CSSProperties = useMemo(() => {
    return {
      ...bRollContainer,
      position: "absolute",
      top: topOffset,
      justifyContent: "center",
      alignItems: "center",
    };
  }, [bRollContainer, topOffset]);

  const biggestLayout: Rect = useMemo(() => {
    return fitElementSizeInContainer({
      containerSize: bRollLayout,
      elementSize: {
        height: bRoll.assetHeight,
        width: bRoll.assetWidth,
      },
    });
  }, [bRoll.assetHeight, bRoll.assetWidth, bRollLayout]);

  const style = useMemo(() => {
    return {
      borderRadius: bRollLayout.borderRadius,
      overflow: "hidden",
      boxShadow: "0 0 50px rgba(0, 0, 0, 0.2)",
      height: biggestLayout.height,
      width: biggestLayout.width,
      aspectRatio: bRoll.assetWidth / bRoll.assetHeight,
    };
  }, [
    bRoll.assetHeight,
    bRoll.assetWidth,
    bRollLayout.borderRadius,
    biggestLayout.height,
    biggestLayout.width,
  ]);

  if (bRollType === "fade") {
    return (
      <FadeBRoll
        rect={biggestLayout}
        appearProgress={appearProgress}
        disappearProgress={disappearProgress}
        bRoll={bRoll}
      />
    );
  }

  return (
    <ScaleDownIfBRollRequiresIt
      canvasLayout={canvasLayout}
      frame={sceneFrame}
      bRolls={bRollsBefore}
      bRollLayout={bRollLayout}
      bRollEnterDirection={bRollEnterDirection}
      style={outerStyle}
      bRollType={bRollType}
    >
      {bRoll.type === "image" ? <Img src={bRoll.source} style={style} /> : null}
      {bRoll.type === "video" ? (
        <OffthreadVideo src={bRoll.source} muted style={style} />
      ) : null}
    </ScaleDownIfBRollRequiresIt>
  );
};

export const BRoll: React.FC<{
  bRoll: BRollWithDimensions;
  bRollsBefore: BRollWithDimensions[];
  bRollEnterDirection: BRollEnterDirection;
  sceneFrame: number;
  bRollLayout: Layout;
  canvasLayout: CanvasLayout;
}> = ({
  bRoll,
  bRollsBefore,
  sceneFrame,
  bRollLayout,
  bRollEnterDirection,
  canvasLayout,
}) => {
  if (bRoll.durationInFrames <= 0) {
    return null;
  }

  return (
    <Sequence from={bRoll.from} durationInFrames={bRoll.durationInFrames}>
      <InnerBRoll
        sceneFrame={sceneFrame}
        bRollsBefore={bRollsBefore}
        bRoll={bRoll}
        bRollLayout={bRollLayout}
        bRollEnterDirection={bRollEnterDirection}
        canvasLayout={canvasLayout}
      />
    </Sequence>
  );
};
