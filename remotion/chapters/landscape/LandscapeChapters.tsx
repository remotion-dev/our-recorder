import React from "react";
import { AbsoluteFill } from "remotion";
import type { VideoSceneAndMetadata } from "../../../config/scenes";
import { isWebCamRight } from "../../animations/webcam-transitions/helpers";

import { Theme } from "../../../config/themes";
import type { ChapterType } from "../make-chapters";
import {
  CHAPTER_HEIGHT,
  CHAPTER_VERTICAL_MARGIN,
  LandscapeChapter,
} from "./LandscapeChapter";
import { getWidescreenChapterStyle } from "./layout";

export const LandscapeChapters: React.FC<{
  scene: VideoSceneAndMetadata;
  chapters: ChapterType[];
  theme: Theme;
}> = ({ chapters, scene, theme }) => {
  const chapterIndex = chapters.findIndex((c) => c.title === scene.chapter);

  const shownChapters =
    chapterIndex === 0
      ? chapters.slice(0, 3)
      : chapters.slice(
          Math.max(0, chapterIndex - 1),
          Math.min(chapters.length, chapterIndex + 2),
        );

  const tableOfContentHeight =
    (CHAPTER_HEIGHT + CHAPTER_VERTICAL_MARGIN * 2) * shownChapters.length -
    CHAPTER_VERTICAL_MARGIN * 2;

  const rightAligned = isWebCamRight(
    scene.webcamPosition === "center" ? "top-left" : scene.webcamPosition,
  );

  const styles = getWidescreenChapterStyle(scene, tableOfContentHeight);

  const chapter = chapters[chapterIndex];
  if (!chapter) {
    return null;
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          height: tableOfContentHeight,
          flex: 1,
          ...styles,
        }}
      >
        {shownChapters.map((chapter, i) => {
          return (
            <LandscapeChapter
              key={chapter.id}
              activeIndex={chapterIndex}
              chapter={chapter}
              isFirstShown={i === 0}
              isLastShown={i === shownChapters.length - 1}
              rightAligned={rightAligned}
              theme={theme}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
