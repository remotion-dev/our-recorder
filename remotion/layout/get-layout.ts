import type { CanvasLayout, Dimensions } from "../../config/layout";
import { getSafeSpace } from "../../config/layout";
import type { FinalWebcamPosition, SceneVideos } from "../../config/scenes";
import { isWebCamAtBottom } from "../animations/webcam-transitions/helpers";
import type { SubtitleType } from "../captions/Segment";
import {
  getSubtitlesFontSize,
  getSubtitlesLines,
  getSubtitlesType,
} from "../captions/Segment";
import { getSubsLayout } from "../captions/subs-layout";
import { getDimensionsForLayout } from "./dimensions";
import {
  getLandscapeDisplayAndWebcamLayout,
  getSquareDisplayLayout,
} from "./get-display-layout";
import { getDisplaySize } from "./get-display-size";
import { getBottomSafeSpace } from "./get-safe-space";
import { getWebcamSize } from "./get-webcam-size";
import type { Layout } from "./layout-types";

export const borderRadius = 20;

const squareFullscreenWebcamLayout = ({
  canvasSize,
  webcamSize,
  webcamPosition,
}: {
  canvasSize: Dimensions;
  webcamSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
}) => {
  const aspectRatio = webcamSize.width / webcamSize.height;

  const maxWidth = canvasSize.width - getSafeSpace("square") * 2;
  // Video can take up 75% of the height to leave place for the subtitles
  const maxHeight = (canvasSize.height - getSafeSpace("square") * 2) * 0.75;

  const provisionalHeight = maxWidth / aspectRatio;
  const width =
    provisionalHeight > maxHeight ? maxHeight * aspectRatio : maxWidth;
  const height = width / aspectRatio;

  const left = (canvasSize.width - width) / 2;

  return {
    left,
    top: isWebCamAtBottom(webcamPosition)
      ? canvasSize.height - height - getSafeSpace("square")
      : getSafeSpace("square"),
    width,
    height,
    borderRadius,
    opacity: 1,
  };
};

const widescreenFullscreenLayout = ({
  canvasSize,
}: {
  canvasSize: Dimensions;
}): Layout => {
  return {
    left: 0,
    top: 0,
    width: canvasSize.width,
    height: canvasSize.height,
    borderRadius: 0,
    opacity: 1,
  };
};

const getSquareBentoBoxWebcamLayout = ({
  webcamSize,
  webcamPosition,
  canvasSize,
}: {
  webcamSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
  canvasSize: Dimensions;
}): Layout => {
  if (webcamPosition === "bottom-right") {
    return {
      ...webcamSize,
      left: canvasSize.width - webcamSize.width - getSafeSpace("square"),
      top: canvasSize.height - webcamSize.height - getBottomSafeSpace("square"),
      borderRadius,
      opacity: 1,
    };
  }

  if (webcamPosition === "bottom-left") {
    return {
      ...webcamSize,
      left: getSafeSpace("square"),
      top: canvasSize.height - webcamSize.height - getBottomSafeSpace("square"),
      borderRadius,
      opacity: 1,
    };
  }

  if (webcamPosition === "top-left") {
    return {
      ...webcamSize,
      left: getSafeSpace("square"),
      top: getSafeSpace("square"),
      borderRadius,
      opacity: 1,
    };
  }

  if (webcamPosition === "top-right") {
    return {
      ...webcamSize,
      left: canvasSize.width - webcamSize.width - getSafeSpace("square"),
      top: getSafeSpace("square"),
      borderRadius,
      opacity: 1,
    };
  }

  return {
    height: webcamSize.height,
    width: webcamSize.width,
    left: 0,
    top: 0,
    borderRadius,
    opacity: 1,
  };
};

const getFullScreenWebcamSize = ({
  webcamVideoResolution,
  canvasSize,
  canvasLayout,
}: {
  webcamVideoResolution: Dimensions;
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
}) => {
  const aspectRatio =
    webcamVideoResolution.width / webcamVideoResolution.height;

  const actualWidth = canvasSize.width - getSafeSpace(canvasLayout) * 2;

  const actualHeight = actualWidth / aspectRatio;

  return {
    height: actualHeight,
    width: actualWidth,
  };
};

export type CameraSceneLayout = {
  webcamLayout: Layout;
  displayLayout: Layout | null;
  subtitleLayout: Layout;
  subtitleType: SubtitleType;
  subtitleFontSize: number;
  subtitleLines: number;
};

const getDisplayAndWebcamLayout = ({
  canvasSize,
  webcamPosition,
  canvasLayout,
  videos,
}: {
  canvasSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
  canvasLayout: CanvasLayout;
  videos: SceneVideos;
}) => {
  if (!videos.display) {
    if (canvasLayout === "square") {
      return {
        displayLayout: null,
        webcamLayout: squareFullscreenWebcamLayout({
          canvasSize,
          webcamPosition,
          webcamSize: getFullScreenWebcamSize({
            canvasSize,
            canvasLayout,
            webcamVideoResolution: videos.webcam,
          }),
        }),
      };
    }

    if (canvasLayout === "landscape") {
      return {
        displayLayout: null,
        webcamLayout: widescreenFullscreenLayout({
          canvasSize,
        }),
      };
    }

    throw new Error(`Unknown canvas layout: ${canvasLayout}`);
  }

  const displaySize = getDisplaySize({
    canvasLayout,
    canvasSize,
    videoHeight: videos.display.height,
    videoWidth: videos.display.width,
  });

  const webcamSize: Dimensions = getWebcamSize({
    canvasSize,
    canvasLayout,
    displaySize,
  });

  if (canvasLayout === "square") {
    const displayLayout = getSquareDisplayLayout({
      canvasSize,
      webcamPosition,
      displaySize,
    });

    const webcamLayout = getSquareBentoBoxWebcamLayout({
      webcamPosition,
      canvasSize,
      webcamSize,
    });

    return {
      displayLayout,
      webcamLayout,
    };
  }

  if (canvasLayout === "landscape") {
    return getLandscapeDisplayAndWebcamLayout({
      displaySize,
      webcamSize,
      canvasLayout,
      canvasSize,
      webcamPosition,
    });
  }

  throw new Error(`Unknown canvas layout: ${canvasLayout}`);
};

export const getLayout = ({
  canvasLayout,
  videos,
  webcamPosition,
}: {
  videos: SceneVideos;
  canvasLayout: CanvasLayout;
  webcamPosition: FinalWebcamPosition;
}): CameraSceneLayout => {
  const canvasSize = getDimensionsForLayout(canvasLayout);

  const { displayLayout, webcamLayout } = getDisplayAndWebcamLayout({
    canvasSize,
    webcamPosition,
    canvasLayout,
    videos,
  });

  const subtitleType = getSubtitlesType({
    canvasLayout,
    displayLayout,
  });

  const subtitleFontSize = getSubtitlesFontSize(subtitleType, displayLayout);
  const subtitleLayout = getSubsLayout({
    canvasLayout,
    canvasSize,
    displayLayout,
    subtitleType,
    webcamLayout,
    webcamPosition,
    fontSize: subtitleFontSize,
  });

  const subtitleLines = getSubtitlesLines({
    boxHeight: subtitleLayout.height,
    fontSize: subtitleFontSize,
    subtitleType,
  });

  return {
    displayLayout,
    webcamLayout,
    subtitleLayout,
    subtitleType,
    subtitleFontSize,
    subtitleLines,
  };
};
