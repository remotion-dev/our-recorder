import React, { useMemo } from "react";
import { OffthreadVideo, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import { getWebcamLayout } from "../../animations/webcam-transitions";
import type { Layout } from "../../layout/layout-types";

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
}) => {
  const { height, width } = useVideoConfig();

  const webcamStyle = getWebcamLayout({
    enterProgress,
    exitProgress,
    canvasHeight: height,
    canvasWidth: width,
    currentScene,
    nextScene,
    previousScene,
    canvasLayout,
  });

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
      <div style={container}>
        <OffthreadVideo
          startFrom={startFrom}
          endAt={endAt}
          style={style}
          src={currentScene.pair.webcam.src}
        />
      </div>
    </div>
  );
};
