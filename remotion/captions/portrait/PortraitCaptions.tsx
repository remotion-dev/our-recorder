import { StaticFile } from "@remotion/studio";
import React from "react";
import { Theme } from "../../../config/themes";
import { CaptionOverlay } from "../editor/CaptionOverlay";
import { SrtPreview } from "../srt/SrtPreviewAndEditor/SrtPreview";

export const PortraitCaptions: React.FC<{
  captions: StaticFile;
  theme: Theme;
  startFrame: number;
}> = ({ captions, startFrame, theme }) => {
  return (
    <CaptionOverlay file={captions} theme={theme} trimStart={startFrame}>
      <SrtPreview startFrame={startFrame}></SrtPreview>
    </CaptionOverlay>
  );
};
