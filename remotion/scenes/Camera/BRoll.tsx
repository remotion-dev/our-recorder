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
  sceneLayout: Layout;
  sceneFrame: number;
}> = ({ bRoll, bRollsBefore, sceneFrame, sceneLayout }) => {
  const { fps, width } = useVideoConfig();
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
    const bRollMaxWidth = width - getSafeSpace("square") * 2;
    const aspectRatio = bRoll.assetWidth / bRoll.assetHeight;
    const bRollHeight = Math.min(
      sceneLayout.height,
      bRollMaxWidth / aspectRatio,
    );
    const bRollWidth = bRollHeight * aspectRatio;
    const top = (sceneLayout.height - bRollHeight) / 2 + getSafeSpace("square");

    return {
      ...sceneLayout,
      left: getSafeSpace("square"),
      width: bRollWidth,
      top,
      height: bRollHeight,
      display: "flex",
    };
  }, [bRoll.assetHeight, bRoll.assetWidth, sceneLayout, width]);

  const topOffset = interpolate(
    appear - disappear,
    [0, 1],
    [-sceneLayout.height - getSafeSpace("square"), 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <ScaleDownWithBRoll
      frame={sceneFrame}
      bRolls={bRollsBefore}
      style={{ position: "absolute", ...bRollContainer }}
    >
      <Img
        src={bRoll.source}
        style={{
          borderRadius: sceneLayout.borderRadius,
          overflow: "hidden",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.2)",
          transform: `translateY(${topOffset}px)`,
        }}
      />
    </ScaleDownWithBRoll>
  );
};

export const BRoll: React.FC<{
  bRoll: BRollScene;
  bRollsBefore: BRollScene[];
  sceneLayout: Layout;
  sceneFrame: number;
}> = ({ bRoll, sceneLayout, bRollsBefore, sceneFrame }) => {
  return (
    <Sequence from={bRoll.from} durationInFrames={bRoll.durationInFrames}>
      <Inner
        sceneFrame={sceneFrame}
        bRollsBefore={bRollsBefore}
        bRoll={bRoll}
        sceneLayout={sceneLayout}
      />
    </Sequence>
  );
};
