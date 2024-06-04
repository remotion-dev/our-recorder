import React from "react";
import { TITLE_FONT_FAMILY, TITLE_FONT_WEIGHT } from "../../../config/fonts";
import { ChapterType } from "../make-chapters";

export const ChapterTimestamp: React.FC<{
  chapter: ChapterType;
}> = ({ chapter }) => {
  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "12px 0px",
        fontSize: 32,
        fontFamily: TITLE_FONT_FAMILY,
        width: 65,
        textAlign: "center",
        height: "100%",
        fontWeight: TITLE_FONT_WEIGHT,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      {chapter.index + 1}
    </div>
  );
};
