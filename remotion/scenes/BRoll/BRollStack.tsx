import React from "react";
import { useCurrentFrame } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type { BRollEnterDirection, Layout } from "../../layout/layout-types";
import { BRoll } from "../Camera/BRoll";
import type { BRollScene } from "./types";

export const BRollStack: React.FC<{
  bRollLayout: Layout;
  bRolls: BRollScene[];
  bRollEnterDirection: BRollEnterDirection;
  canvasLayout: CanvasLayout;
}> = ({ bRollLayout, bRollEnterDirection, canvasLayout, bRolls }) => {
  const frame = useCurrentFrame();

  return (
    <>
      {bRolls.map((roll, i) => {
        return (
          <BRoll
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            bRoll={roll}
            bRollsBefore={bRolls.slice(i + 1)}
            sceneFrame={frame}
            bRollLayout={bRollLayout}
            bRollEnterDirection={bRollEnterDirection}
            canvasLayout={canvasLayout}
          />
        );
      })}
    </>
  );
};
