import { Dimensions } from "@remotion/layout-utils";
import { CanvasLayout, getSafeSpace } from "../../../config/layout";
import { WebcamPosition } from "../../../config/scenes";
import {
  isWebCamAtBottom,
  isWebCamRight,
} from "../../animations/webcam-transitions/helpers";
import { borderRadius, fullscreenLayout } from "../get-layout";
import { Layout, RecordingsLayout } from "../layout-types";

export const getLandscapeDisplayAndWebcamLayout = ({
  webcamSize,
  canvasLayout,
  canvasSize,
  webcamPosition,
}: {
  webcamSize: Dimensions;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  webcamPosition: WebcamPosition;
}): RecordingsLayout => {
  const displayLayout: Layout = fullscreenLayout(canvasSize);

  const webcamLayout: Layout = {
    borderRadius,
    height: webcamSize.height,
    width: webcamSize.width,
    opacity: 1,
    left: isWebCamRight(webcamPosition)
      ? canvasSize.width - webcamSize.width - getSafeSpace(canvasLayout)
      : getSafeSpace("landscape"),
    top: isWebCamAtBottom(webcamPosition)
      ? canvasSize.height - webcamSize.height - getSafeSpace(canvasLayout)
      : getSafeSpace("landscape"),
  };

  return {
    displayLayout,
    webcamLayout,
    bRollLayout: displayLayout,
    bRollEnterDirection: isWebCamAtBottom(webcamPosition) ? "top" : "bottom",
    displayBlurLayout: null,
  };
};
