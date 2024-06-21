import type { Theme } from "../../../config/themes";
import type { CaptionPage } from "../types";
import { CaptionSentence } from "./CaptionSentence";

export const Captions: React.FC<{
  trimStart: number;
  theme: Theme;
  segments: CaptionPage[];
  fontSize: number;
  lines: number;
}> = ({ trimStart, segments, theme, fontSize, lines }) => {
  return (
    <>
      {segments.map((segment, index) => {
        return (
          <CaptionSentence
            key={index}
            isFirst={index === 0}
            isLast={index === segments.length - 1}
            segment={segment}
            trimStart={trimStart}
            theme={theme}
            fontSize={fontSize}
            lines={lines}
          />
        );
      })}
    </>
  );
};
