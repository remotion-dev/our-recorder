import React, { useMemo } from "react";
import { spring, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type { BRoll } from "../../../config/scenes";
import { B_ROLL_TRANSITION_DURATION } from "../../../config/transitions";
import type { BRollEnterDirection, Layout } from "../../layout/layout-types";

// A value of 0.1 means that the original
// video only has a 90% of its original size
// when a b-roll is shown
const SCALE_DOWN = 0.1;

export const ScaleDownWithBRoll: React.FC<
  {
    bRolls: BRoll[];
    frame: number;
    canvasLayout: CanvasLayout;
    bRollLayout: Layout;
    bRollEnterDirection: BRollEnterDirection;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({
  bRolls,
  frame,
  canvasLayout,
  bRollLayout,
  bRollEnterDirection,
  style: passedStyle,
  ...props
}) => {
  const { fps } = useVideoConfig();

  const springs = bRolls.map((roll) => {
    const enter = spring({
      fps,
      frame,
      config: {
        damping: 200,
      },
      delay: roll.from,
      durationInFrames: B_ROLL_TRANSITION_DURATION,
    });
    const exit = spring({
      fps,
      frame,
      config: {
        damping: 200,
      },
      delay: roll.from + roll.durationInFrames - B_ROLL_TRANSITION_DURATION,
      durationInFrames: B_ROLL_TRANSITION_DURATION,
    });
    return enter - exit;
  }, []);

  const scale = useMemo(() => {
    return springs.reduce((acc, instance) => {
      return acc - instance * SCALE_DOWN;
    }, 1);
  }, [springs]);

  const style = useMemo(() => {
    return {
      ...(passedStyle ?? {}),
      scale: String(scale),
    };
  }, [passedStyle, scale]);

  return <div {...props} style={style} />;
};
