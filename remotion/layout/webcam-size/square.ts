import { Dimensions } from "@remotion/layout-utils";
import { CanvasLayout, getSafeSpace } from "../../../config/layout";

// TODO: Use this also in the recording interface
const webcamRatio = 400 / 350;

export const getSquareWebcamSize = ({
  canvasSize,
  displaySize,
  canvasLayout,
}: {
  canvasSize: Dimensions;
  displaySize: Dimensions;
  canvasLayout: CanvasLayout;
}) => {
  const remainingHeight =
    canvasSize.height - displaySize.height - getSafeSpace(canvasLayout) * 3;

  return {
    height: remainingHeight,
    width: remainingHeight * (1 / webcamRatio),
  };
};
