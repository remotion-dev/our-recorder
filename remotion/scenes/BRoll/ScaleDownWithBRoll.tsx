import React from "react";
import { spring, useVideoConfig } from "remotion";
import type { BRollScene } from "../Camera/BRoll";

export const ScaleDownWithBRoll: React.FC<
  {
    bRolls: BRollScene[];
    frame: number;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({ bRolls, frame, ...props }) => {
  const { fps } = useVideoConfig();

  const springs = bRolls.map((roll) => {
    return (
      spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        delay: roll.from,
        durationInFrames: 15,
      }) -
      spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        delay: roll.from + roll.durationInFrames - 15,
        durationInFrames: 15,
      })
    );
  }, []);

  const scaleFromBRoll = springs.reduce((acc, scale) => {
    return acc - scale * 0.1;
  }, 1);

  const translation = springs.reduce((acc, scale) => {
    return acc + scale * 50;
  }, 0);

  return (
    <div
      {...props}
      style={{
        ...props.style,
        scale: String(scaleFromBRoll),
        translate: `0 ${translation}px`,
      }}
    />
  );
};
