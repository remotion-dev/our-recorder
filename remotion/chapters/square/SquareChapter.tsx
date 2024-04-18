import React, { useMemo } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TITLE_FONT_FAMILY, TITLE_FONT_WEIGHT } from "../../../config/fonts";
import { getSafeSpace } from "../../../config/layout";
import { SCENE_TRANSITION_DURATION } from "../../../config/transitions";
import { borderRadius } from "../../layout/get-layout";
import type { Layout } from "../../layout/layout-types";

const HEIGHT = 90;

export const SquareChapter: React.FC<{
  title: string;
  didTransitionIn: boolean;
  displayLayout: Layout | null;
  webcamLayout: Layout;
}> = ({ title, webcamLayout, didTransitionIn, displayLayout }) => {
  const top = useMemo(() => {
    if (displayLayout) {
      return (
        displayLayout.top +
        displayLayout.height -
        getSafeSpace("square") -
        HEIGHT
      );
    }

    return (
      webcamLayout.top + webcamLayout.height - getSafeSpace("square") - HEIGHT
    );
  }, [displayLayout, webcamLayout.height, webcamLayout.top]);

  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    delay: didTransitionIn ? SCENE_TRANSITION_DURATION : 0,
  });

  const toLeft =
    spring({
      fps,
      frame,
      config: {
        damping: 200,
      },
      delay: 70,
    }) * -width;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          color: "white",
          padding: "0 38px",
          background: "black",
          fontFamily: TITLE_FONT_FAMILY,
          position: "absolute",
          top,
          height: HEIGHT,
          left: getSafeSpace("square") * 2,
          borderRadius,
          fontSize: 42,
          fontWeight: TITLE_FONT_WEIGHT,
          scale: String(scale),
          display: "flex",
          alignItems: "center",
          boxShadow: "0 -20px 100px rgba(255, 255, 255, 0.2)",
          transform: `translateX(${toLeft}px)`,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
