import React, { useMemo } from "react";
import { OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import { getWebcamLayout } from "../../animations/webcam-transitions";
import type { BRollEnterDirection, Layout } from "../../layout/layout-types";
import { BRollStack } from "../BRoll/BRollStack";
import { ScaleDownWithBRoll } from "../BRoll/ScaleDownWithBRoll";
import type { BRollScene } from "../BRoll/types";

const outer: React.CSSProperties = {
  position: "absolute",
  display: "flex",
};

export const Webcam: React.FC<{
  webcamLayout: Layout;
  enterProgress: number;
  exitProgress: number;
  startFrom: number;
  endAt: number | undefined;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  bRolls: BRollScene[];
  bRollLayout: Layout;
  bRollEnterDirection: BRollEnterDirection;
}> = ({
  webcamLayout,
  enterProgress,
  exitProgress,
  startFrom,
  endAt,
  nextScene,
  previousScene,
  canvasLayout,
  currentScene,
  bRolls,
  bRollLayout,
  bRollEnterDirection,
}) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();

  const webcamStyle = useMemo(() => {
    return getWebcamLayout({
      enterProgress,
      exitProgress,
      canvasHeight: height,
      canvasWidth: width,
      currentScene,
      nextScene,
      previousScene,
      canvasLayout,
    });
  }, [
    canvasLayout,
    currentScene,
    enterProgress,
    exitProgress,
    height,
    nextScene,
    previousScene,
    width,
  ]);

  const container: React.CSSProperties = useMemo(() => {
    return {
      overflow: "hidden",
      position: "relative",
      ...webcamStyle,
    };
  }, [webcamStyle]);

  const style: React.CSSProperties = useMemo(() => {
    return {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      borderRadius: webcamLayout.borderRadius,
      overflow: "hidden",
      transformOrigin: "50% 0%",
    };
  }, [webcamLayout.borderRadius]);

  return (
    <div style={outer}>
      <ScaleDownWithBRoll bRolls={bRolls} frame={frame} style={container}>
        <OffthreadVideo
          startFrom={startFrom}
          endAt={endAt}
          style={style}
          src={currentScene.pair.webcam.src}
        />
      </ScaleDownWithBRoll>
      <BRollStack
        bRollEnterDirection={bRollEnterDirection}
        bRolls={bRolls}
        bRollLayout={bRollLayout}
      />
    </div>
  );
};
