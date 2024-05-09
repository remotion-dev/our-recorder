import React, { useMemo } from "react";
import { Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type { BRollWithDimensions } from "../../../config/scenes";
import { B_ROLL_TRANSITION_DURATION } from "../../../config/transitions";
import { fitElementSizeInContainer } from "../../layout/fit-element";
import type {
  BRollEnterDirection,
  Layout,
  Rect,
} from "../../layout/layout-types";
import { FadeBRoll } from "./FadeBRoll";
import { ScaleDownBRoll } from "./ScaleDownBRoll";

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
  const { fps } = useVideoConfig();
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

  const biggestLayout: Rect = useMemo(() => {
    return fitElementSizeInContainer({
      containerSize: bRollLayout,
      elementSize: {
        height: bRoll.assetHeight,
        width: bRoll.assetWidth,
      },
    });
  }, [bRoll.assetHeight, bRoll.assetWidth, bRollLayout]);

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
    <ScaleDownBRoll
      bRoll={bRoll}
      bRollsBefore={bRollsBefore}
      bRollLayout={bRollLayout}
      bRollEnterDirection={bRollEnterDirection}
      canvasLayout={canvasLayout}
      sceneFrame={sceneFrame}
      appearProgress={appearProgress}
      disappearProgress={disappearProgress}
    />
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
