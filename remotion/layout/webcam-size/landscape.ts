import { Dimensions } from "@remotion/layout-utils";
import { CanvasLayout, getSafeSpace } from "../../../config/layout";

// TODO: Use this also in the recording interface
const webcamRatio = 400 / 350;

export const getLandscapeWebcamSize = ({
  canvasLayout,
  canvasSize,
  displaySize,
}: {
  canvasSize: Dimensions;
  displaySize: Dimensions;
  canvasLayout: CanvasLayout;
}) => {
  const remainingWidth =
    canvasSize.width - displaySize.width - getSafeSpace(canvasLayout) * 3;
  const maxWidth = 350;
  const width = Math.min(remainingWidth, maxWidth);

  const height = webcamRatio * width;

  return {
    width,
    height,
  };
};
