import { z } from "zod";

export type Dimensions = {
  width: number;
  height: number;
};

export const canvasLayout = z.enum(["landscape", "square", "portrait"]);
export type CanvasLayout = z.infer<typeof canvasLayout>;

export const DIMENSIONS: { [key in CanvasLayout]: Dimensions } = {
  landscape: {
    width: 1920,
    height: 1080,
  },
  portrait: {
    width: 1080,
    height: 1920,
  },
  square: {
    width: 1080,
    height: 1080,
  },
};

export const LANDSCAPE_DISPLAY_MAX_WIDTH_OF_CANVAS = 0.77;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSafeSpace = (_canvasLayout: CanvasLayout) => 30;
