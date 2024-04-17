import React, { useMemo } from "react";
import {
  Img,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type { BRollEnterDirection, Layout } from "../../layout/layout-types";
import { ScaleDownWithBRoll } from "../BRoll/ScaleDownWithBRoll";
import type { BRollScene } from "../BRoll/types";

const Inner: React.FC<{
  bRoll: BRollScene;
  bRollsBefore: BRollScene[];
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
  const { fps, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const appear = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: 15,
  });

  const disappear = spring({
    fps,
    frame,
    delay: bRoll.durationInFrames - 15,
    config: {
      damping: 200,
    },
    durationInFrames: 15,
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
      return height;
    }

    throw new Error(`Invalid direction ${bRollEnterDirection}`);
  }, [bRollEnterDirection, bRollLayout.height, height]);

  const topOffset = interpolate(
    appear - disappear,
    [0, 1],
    [enterPosition, bRollLayout.top],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <ScaleDownWithBRoll
      canvasLayout={canvasLayout}
      frame={sceneFrame}
      bRolls={bRollsBefore}
      bRollLayout={bRollLayout}
      bRollEnterDirection={bRollEnterDirection}
      style={{
        position: "absolute",
        ...bRollContainer,
        top: topOffset,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Img
        src={bRoll.source}
        style={{
          borderRadius: bRollLayout.borderRadius,
          overflow: "hidden",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.2)",
          height: "100%",
        }}
      />
    </ScaleDownWithBRoll>
  );
};

export const BRoll: React.FC<{
  bRoll: BRollScene;
  bRollsBefore: BRollScene[];
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
  return (
    <Sequence from={bRoll.from} durationInFrames={bRoll.durationInFrames}>
      <Inner
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
