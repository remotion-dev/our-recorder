import { Dimensions } from "@remotion/layout-utils";
import { WebcamPosition } from "../../../config/scenes";
import { isWebCamAtBottom } from "../../animations/webcam-transitions/helpers";
import { Layout, RecordingsLayout } from "../layout-types";

export const getPortraitDisplayAndWebcamLayout = ({
  canvasSize,
  webcamPosition,
}: {
  canvasSize: Dimensions;
  webcamPosition: WebcamPosition;
}): RecordingsLayout => {
  const displayLayout: Layout = {
    borderRadius: 0,
    height: canvasSize.height / 2,
    width: canvasSize.width,
    opacity: 1,
    left: 0,
    top: isWebCamAtBottom(webcamPosition) ? 0 : canvasSize.height / 2,
  };

  const webcamLayout: Layout = {
    borderRadius: 0,
    height: canvasSize.height / 2,
    width: canvasSize.width,
    opacity: 1,
    left: 0,
    top: isWebCamAtBottom(webcamPosition) ? canvasSize.height / 2 : 0,
  };

  return {
    displayLayout,
    webcamLayout,
    bRollLayout: displayLayout,
    bRollEnterDirection: isWebCamAtBottom(webcamPosition) ? "top" : "bottom",
  };
};
