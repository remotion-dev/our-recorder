import type { CanvasLayout } from "../../config/layout";
import type { Theme } from "../../config/themes";
import { CaptionSentence } from "./Segment";
import type { CaptionPage } from "./types";

export const Captions: React.FC<{
  trimStart: number;
  canvasLayout: CanvasLayout;
  theme: Theme;
  segments: CaptionPage[];
  fontSize: number;
  lines: number;
}> = ({ trimStart, canvasLayout, segments, theme, fontSize, lines }) => {
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
            canvasLayout={canvasLayout}
            theme={theme}
            fontSize={fontSize}
            lines={lines}
          />
        );
      })}
    </>
  );
};
