import React, { useMemo } from "react";
import { TITLE_FONT_FAMILY, TITLE_FONT_WEIGHT } from "../../../config/fonts";
import { COLORS, type Theme } from "../../../config/themes";
import type { ChapterType } from "../make-chapters";
import { ChapterTimestamp } from "./ChapterTimestamp";

export const CHAPTER_HEIGHT = 80;
export const CHAPTER_VERTICAL_MARGIN = 4;

export const LandscapeChapter: React.FC<{
  chapter: ChapterType;
  activeIndex: number;
  isFirstShown: boolean;
  isLastShown: boolean;
  rightAligned: boolean;
  theme: Theme;
}> = ({
  chapter,
  activeIndex,
  isLastShown,
  isFirstShown,
  rightAligned,
  theme,
}) => {
  const isCurrent = chapter.index === activeIndex;

  const textStyle: React.CSSProperties = useMemo(() => {
    return {
      padding: "0px 20px",
      fontSize: 36,
      fontFamily: TITLE_FONT_FAMILY,
      fontWeight: TITLE_FONT_WEIGHT,
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      right: rightAligned ? undefined : 0,
      left: rightAligned ? 0 : undefined,
    };
  }, [rightAligned]);

  return (
    <div>
      <div
        style={{
          display: "inline-flex",
          borderRadius: 20,
          border: "5px solid black",
          marginTop: isFirstShown ? 0 : CHAPTER_VERTICAL_MARGIN,
          marginBottom: isLastShown ? 0 : CHAPTER_VERTICAL_MARGIN,
          overflow: "hidden",
          height: CHAPTER_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {rightAligned ? null : <ChapterTimestamp chapter={chapter} />}
        <div
          style={{
            ...textStyle,
            backgroundColor: isCurrent ? COLORS[theme].ACCENT_COLOR : "white",
            padding: "0px 20px",
            color: isCurrent ? "white" : "black",
          }}
        >
          {chapter.title}
        </div>
        {rightAligned ? <ChapterTimestamp chapter={chapter} /> : null}
      </div>
    </div>
  );
};
