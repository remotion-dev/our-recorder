import type { CanvasLayout } from "../../config/layout";
import { getSafeSpace, type Dimensions } from "../../config/layout";
import type { FinalWebcamPosition } from "../../config/scenes";
import {
  isWebCamAtBottom,
  isWebCamRight,
} from "../animations/webcam-transitions/helpers";
import { borderRadius } from "./get-layout";
import { getBottomSafeSpace } from "./get-safe-space";
import type { Layout } from "./layout-types";

const getY = ({
  webcamPosition,
  canvasSize,
  displayHeight,
}: {
  webcamPosition: FinalWebcamPosition;
  canvasSize: Dimensions;
  displayHeight: number;
}): number => {
  if (isWebCamAtBottom(webcamPosition)) {
    return getSafeSpace("square");
  }

  return canvasSize.height - displayHeight - getSafeSpace("square");
};

export const getSquareDisplayLayout = ({
  canvasSize,
  webcamPosition,
  displaySize,
}: {
  canvasSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
  displaySize: Dimensions;
}): Layout => {
  return {
    left: (canvasSize.width - displaySize.width) / 2,
    top: getY({
      webcamPosition,
      canvasSize,
      displayHeight: displaySize.height,
    }),
    width: displaySize.width,
    height: displaySize.height,
    borderRadius,
    opacity: 1,
  };
};

export const getLandscapeDisplayAndWebcamLayout = ({
  displaySize,
  webcamSize,
  canvasLayout,
  canvasSize,
  webcamPosition,
}: {
  displaySize: Dimensions;
  webcamSize: Dimensions;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
}) => {
  const totalWidth =
    displaySize.width + webcamSize.width + getSafeSpace(canvasLayout);

  const totalHeight = Math.max(displaySize.height, webcamSize.height);
  const left = (canvasSize.width - totalWidth) / 2;
  const top =
    (canvasSize.height - totalHeight) / 2 -
    (getBottomSafeSpace(canvasLayout) - getSafeSpace(canvasLayout)) / 2;

  const displayLayout: Layout = {
    borderRadius,
    height: displaySize.height,
    width: displaySize.width,
    opacity: 1,
    left: isWebCamRight(webcamPosition)
      ? left
      : left + getSafeSpace("landscape") + webcamSize.width,
    top,
  };

  return displayLayout;
};
