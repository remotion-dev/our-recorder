import { StaticFile } from "@remotion/studio";
import React from "react";
import { Theme } from "../../../config/themes";
import { Layout } from "../../layout/layout-types";
import { CaptionOverlay } from "../editor/CaptionOverlay";
import { PortraitWords } from "./PortraitWords";

export const PortraitCaptions: React.FC<{
  captions: StaticFile;
  theme: Theme;
  startFrame: number;
  webcamLayout: Layout;
}> = ({ captions, startFrame, theme, webcamLayout }) => {
  return (
    <CaptionOverlay file={captions} theme={theme} trimStart={startFrame}>
      <PortraitWords webcamLayout={webcamLayout} startFrame={startFrame} />
    </CaptionOverlay>
  );
};
