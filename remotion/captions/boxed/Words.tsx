import React from "react";
import type { Theme } from "../../../config/themes";
import type { CaptionPage } from "../types";
import { SingleWord } from "./SingleWord";

export const Words: React.FC<{
  segment: CaptionPage;
  theme: Theme;
  startFrame: number;
}> = ({ segment, startFrame, theme }) => {
  return (
    <>
      {segment.words.map((word, index) => {
        return (
          <SingleWord
            key={word.firstTimestamp + word.text + index}
            isLast={index === segment.words.length - 1}
            word={word}
            theme={theme}
            startFrame={startFrame}
          />
        );
      })}
    </>
  );
};
