import { Dimensions } from "@remotion/layout-utils";
import { getSafeSpace } from "../../../config/layout";
import { fitElementSizeInContainer } from "../fit-element";

export const getSquareDisplaySize = ({
  canvasSize,
  videoHeight,
  videoWidth,
}: {
  canvasSize: Dimensions;
  videoWidth: number;
  videoHeight: number;
}): Dimensions => {
  const bottomSafeSpace = getSafeSpace("square");

  const withoutSafeAreas =
    canvasSize.height - bottomSafeSpace - getSafeSpace("square");

  const maxHeight = withoutSafeAreas * (3 / 5);

  const maxWidth = canvasSize.width - getSafeSpace("square") * 2;

  const { width, height } = fitElementSizeInContainer({
    containerSize: { width: maxWidth, height: maxHeight },
    elementSize: { width: videoWidth, height: videoHeight },
  });

  return { width, height };
};
