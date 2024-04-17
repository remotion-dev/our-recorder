import React, { useMemo } from "react";
import {
  Img,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getSafeSpace } from "../../../config/layout";
import type { Layout } from "../../layout/layout-types";
import { ScaleDownWithBRoll } from "../BRoll/ScaleDownWithBRoll";
import type { BRollScene } from "../BRoll/types";

const Inner: React.FC<{
  bRoll: BRollScene;
  bRollsBefore: BRollScene[];
  bRollLayout: Layout;
  sceneFrame: number;
}> = ({ bRoll, bRollsBefore, bRollLayout, sceneFrame }) => {
  const { fps } = useVideoConfig();
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

  const topOffset = interpolate(
    appear - disappear,
    [0, 1],
    [-bRollLayout.height - getSafeSpace("square"), 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <ScaleDownWithBRoll
      frame={sceneFrame}
      bRolls={bRollsBefore}
      style={{
        position: "absolute",
        ...bRollContainer,
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
          transform: `translateY(${topOffset}px)`,
          height: "100%",
        }}
      />
    </ScaleDownWithBRoll>
  );
};

export const BRoll: React.FC<{
  bRoll: BRollScene;
  bRollsBefore: BRollScene[];
  sceneFrame: number;
  bRollLayout: Layout;
}> = ({ bRoll, bRollsBefore, sceneFrame, bRollLayout }) => {
  return (
    <Sequence from={bRoll.from} durationInFrames={bRoll.durationInFrames}>
      <Inner
        sceneFrame={sceneFrame}
        bRollsBefore={bRollsBefore}
        bRoll={bRoll}
        bRollLayout={bRollLayout}
      />
    </Sequence>
  );
};
