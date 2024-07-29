import { Dimensions } from "@remotion/layout-utils";
import { WebcamPosition } from "../../../config/scenes";
import { isWebCamAtBottom } from "../../animations/webcam-transitions/helpers";
import { fitElementSizeInContainer } from "../fit-element";
import { Layout, RecordingsLayout } from "../layout-types";

const TOP_SAFE_ZONE = 220;

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
      height: totalUsableSpace / 2,
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

  const webcamLayout: Layout = {
    borderRadius: 0,
    height: totalUsableSpace - fitDisplay.height,
    width: canvasSize.width,
    opacity: 1,
    left: 0,
    top: fitDisplay.height + TOP_SAFE_ZONE,
  };

  return {
    displayLayout,
    webcamLayout,
    bRollLayout: displayLayout,
    bRollEnterDirection: isWebCamAtBottom(webcamPosition) ? "top" : "bottom",
  };
};
