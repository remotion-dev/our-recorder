import { Dimensions } from "@remotion/layout-utils";
import { WebcamPosition } from "../../../config/scenes";
import { isWebCamAtBottom } from "../../animations/webcam-transitions/helpers";
import { fitElementSizeInContainer } from "../fit-element";
import { Layout, RecordingsLayout, Rect } from "../layout-types";

const TOP_SAFE_ZONE = 220;

const MIN_WEBCAM_HEIGHT = 500;

export const getPortraitDisplayAndWebcamLayout = ({
  canvasSize,
  webcamPosition,
  displayDimensions,
}: {
  canvasSize: Dimensions;
  webcamPosition: WebcamPosition;
  displayDimensions: Dimensions;
}): RecordingsLayout => {
  const totalUsableSpace = canvasSize.height - TOP_SAFE_ZONE;

  const fitDisplay = fitElementSizeInContainer({
    containerSize: {
      width: canvasSize.width,
      height: totalUsableSpace,
    },
    elementSize: displayDimensions,
  });

  const displayLayout: Layout = {
    borderRadius: 0,
    height: fitDisplay.height,
    width: canvasSize.width,
    opacity: 1,
    left: 0,
    top: TOP_SAFE_ZONE,
  };

  const webcamHeight = Math.max(
    MIN_WEBCAM_HEIGHT,
    totalUsableSpace - fitDisplay.height,
  );

  const top = canvasSize.height - webcamHeight;

  const webcamLayout: Layout = {
    borderRadius: 0,
    height: webcamHeight,
    width: canvasSize.width,
    opacity: 1,
    left: 0,
    top,
  };

  const displayBlurLayout: Rect = {
    height: TOP_SAFE_ZONE + webcamHeight,
    width: canvasSize.width,
    left: 0,
    top: 0,
  };

  return {
    displayLayout,
    webcamLayout,
    bRollLayout: displayLayout,
    bRollEnterDirection: isWebCamAtBottom(webcamPosition) ? "top" : "bottom",
    displayBlurLayout,
  };
};
