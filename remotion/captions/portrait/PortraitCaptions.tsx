import { StaticFile } from "@remotion/studio";
import React from "react";
import { Theme } from "../../../config/themes";
import { CaptionOverlay } from "../editor/CaptionOverlay";
import { PortraitWords } from "./PortraitWords";

export const PortraitCaptions: React.FC<{
  captions: StaticFile;
  theme: Theme;
  startFrame: number;
}> = ({ captions, startFrame, theme }) => {
  return (
    <CaptionOverlay file={captions} theme={theme} trimStart={startFrame}>
      <PortraitWords startFrame={startFrame} />
    </CaptionOverlay>
  );
};
