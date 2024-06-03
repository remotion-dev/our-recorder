import { getSafeSpace } from "../../../config/layout";
import type { VideoSceneAndMetadata } from "../../../config/scenes";
import {} from "../../animations/webcam-transitions";
import {
  isWebCamAtBottom,
  isWebCamRight,
} from "../../animations/webcam-transitions/helpers";
import type { Layout } from "../../layout/layout-types";

const getWidescreenChapterLayout = (
  scene: VideoSceneAndMetadata,
  tableOfContentHeight: number,
): Layout => {
  const { layout, webcamPosition } = scene;

  if (webcamPosition === "center") {
    return {
      height: 1000,
      borderRadius: 0,
      opacity: 1,
      left: getSafeSpace("landscape"),
      top: getSafeSpace("landscape"),
      width: 10000,
    };
  }

  const rightAligned = isWebCamRight(webcamPosition);
  const bottomAligned = isWebCamAtBottom(webcamPosition);

  const chapterLayout: Layout = {
    height: 1000,
    borderRadius: 0,
    opacity: 1,
    ...(rightAligned
      ? {
          left: 0,
          width: layout.webcamLayout.left + layout.webcamLayout.width,
        }
      : { left: layout.webcamLayout.left, width: 100000 }),
    ...(bottomAligned
      ? {
          top:
            layout.webcamLayout.top -
            tableOfContentHeight -
            getSafeSpace("landscape"),
        }
      : {
          top:
            getSafeSpace("landscape") +
            layout.webcamLayout.top +
            layout.webcamLayout.height,
        }),
  };

  return chapterLayout;
};

export const getWidescreenChapterStyle = (
  scene: VideoSceneAndMetadata,
  tableOfContentHeight: number,
) => {
  const chapterLayout = getWidescreenChapterLayout(scene, tableOfContentHeight);

  const rightAligned = isWebCamRight(
    scene.webcamPosition === "center" ? "top-left" : scene.webcamPosition,
  );

  const style: React.CSSProperties = {
    left: chapterLayout.left,
    top: chapterLayout.top,
    width: chapterLayout.width,
    height: chapterLayout.height,
    ...(rightAligned
      ? {
          alignSelf: "flex-end",
          alignItems: "flex-end",
        }
      : {}),
  };
  return style;
};
