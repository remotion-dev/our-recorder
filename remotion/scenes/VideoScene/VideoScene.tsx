import React, { useMemo } from "react";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Theme } from "../../../config/themes";
import { getShouldTransitionIn } from "../../animations/transitions";
import { SrtPreview } from "../../captions/srt/SrtPreview/SrtPreview";
import { serializeSrt } from "../../captions/srt/helpers/serialize-srt";
import { LandscapeChapters } from "../../chapters/landscape/LandscapeChapters";
import type { ChapterType } from "../../chapters/make-chapters";
import { SquareChapter } from "../../chapters/square/SquareChapter";
import { BoxedCaptions } from "./BoxedCaptions";
import { Display } from "./Display";
import { Webcam } from "./Webcam";

export const VideoScene: React.FC<{
  enterProgress: number;
  exitProgress: number;
  canvasLayout: CanvasLayout;
  sceneAndMetadata: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  theme: Theme;
  chapters: ChapterType[];
  willTransitionToNextScene: boolean;
}> = ({
  enterProgress,
  exitProgress,
  sceneAndMetadata,
  canvasLayout,
  nextScene,
  previousScene,
  theme,
  chapters,
}) => {
  const startFrom = sceneAndMetadata.startFrame;
  const endAt = sceneAndMetadata.endFrame;

  if (sceneAndMetadata.type !== "video-scene") {
    throw new Error("Not a camera scene");
  }

  const didTransitionIn = getShouldTransitionIn({
    previousSceneAndMetadata: previousScene,
    sceneAndMetadata: sceneAndMetadata,
    canvasLayout,
  });

  const bRollsOnTopOfWebcam = useMemo(() => {
    if (sceneAndMetadata.cameras.display !== null) {
      return [];
    }
    return sceneAndMetadata.bRolls;
  }, [sceneAndMetadata.bRolls, sceneAndMetadata.cameras.display]);

  const srtFile = useMemo(() => {
    return serializeSrt(sceneAndMetadata.srt);
  }, [sceneAndMetadata.srt]);

  return (
    <>
      {sceneAndMetadata.cameras.display ? (
        <Display
          scene={sceneAndMetadata}
          enterProgress={enterProgress}
          exitProgress={exitProgress}
          nextScene={nextScene}
          previousScene={previousScene}
          startFrom={startFrom}
          endAt={endAt}
          canvasLayout={canvasLayout}
        />
      ) : null}
      <Webcam
        bRolls={bRollsOnTopOfWebcam}
        currentScene={sceneAndMetadata}
        endAt={endAt}
        enterProgress={enterProgress}
        exitProgress={exitProgress}
        startFrom={startFrom}
        canvasLayout={canvasLayout}
        nextScene={nextScene}
        previousScene={previousScene}
      />
      {canvasLayout === "square" ? (
        <BoxedCaptions
          enterProgress={enterProgress}
          exitProgress={exitProgress}
          nextScene={nextScene}
          previousScene={previousScene}
          sceneAndMetadata={sceneAndMetadata}
          startFrom={startFrom}
          theme={theme}
        />
      ) : null}
      {sceneAndMetadata.scene.newChapter && canvasLayout === "square" ? (
        <SquareChapter
          title={sceneAndMetadata.scene.newChapter}
          displayLayout={sceneAndMetadata.layout.displayLayout}
          webcamLayout={sceneAndMetadata.layout.webcamLayout}
          didTransitionIn={didTransitionIn}
        />
      ) : null}
      {sceneAndMetadata.scene.newChapter && canvasLayout === "landscape" ? (
        <LandscapeChapters
          scene={sceneAndMetadata}
          theme={theme}
          chapters={chapters}
          didTransitionIn={didTransitionIn}
        />
      ) : null}
      {srtFile &&
      canvasLayout === "landscape" &&
      sceneAndMetadata.cameras.captions ? (
        <SrtPreview
          captions={sceneAndMetadata.cameras.captions}
          startFrom={startFrom}
          srt={sceneAndMetadata.srt}
          theme={theme}
        ></SrtPreview>
      ) : null}
    </>
  );
};
