import type React from "react";
import type { Dimensions } from "../../config/layout";
import { fitElementSizeInContainer } from "./fit-element";
import type { Layout } from "./layout-types";

export const getBlurLayout = ({
  containerLayout,
  assetSize,
}: {
  containerLayout: Layout;
  assetSize: Dimensions;
}) => {
  const inner = fitElementSizeInContainer({
    containerSize: containerLayout,
    elementSize: assetSize,
  });

  const outerStyle: React.CSSProperties = {
    ...containerLayout,
    left: 0,
    top: 0,
    overflow: "hidden",
  };

  const innerStyle: React.CSSProperties = {
    position: "absolute",
    ...containerLayout,
    ...inner,
  };

  const needsBlur = inner.left > 0.000001 || inner.top > 0.000001;

  return {
    needsBlur,
    outerStyle,
    innerStyle,
    blurStyle: {
      // Chrome has "blur bleed" where it does not blur the edges of the image.
      // Fixing by making the image larger
      width: "110%",
      height: "110%",
      objectFit: "cover",
      filter: "blur(20px)",
      top: "-5%",
      left: "-5%",
      position: "absolute",
    } as React.CSSProperties,
  };
};
