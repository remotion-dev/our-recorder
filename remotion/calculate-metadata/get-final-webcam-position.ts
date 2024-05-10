import { CanvasLayout } from "../../config/layout";
import {
  Cameras,
  FinalWebcamPosition,
  SelectableScene,
  WebcamPosition,
} from "../../config/scenes";

export const getFinalWebcamPosition = ({
  webcamPosition,
  scenes,
  index,
  cameras,
  canvasLayout,
}: {
  webcamPosition: WebcamPosition | "previous";
  scenes: SelectableScene[];
  index: number;
  cameras: Cameras;
  canvasLayout: CanvasLayout;
}): FinalWebcamPosition => {
  if (!cameras.display && canvasLayout === "landscape") {
    return "center";
  }

  let idx = index;

  while (webcamPosition === "previous" && idx >= 0) {
    const prevScene = scenes[idx] as SelectableScene;
    if (prevScene.type === "videoscene") {
      webcamPosition = prevScene.webcamPosition;
    }

    if (webcamPosition === "previous" && idx === 0) {
      webcamPosition = "top-left";
    }

    idx -= 1;
  }

  if (webcamPosition === "previous") {
    throw new Error('Invalid webcam position "previous"');
  }

  return webcamPosition;
};
