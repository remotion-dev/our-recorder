import {
  fontFamily as regularFont,
  loadFont as loadRegular,
} from "@remotion/google-fonts/Inter";

const regular = loadRegular();

export const waitForFonts = async () => {
  await regular.waitUntilDone();
};

export const REGULAR_FONT_FAMILY = regularFont;
export const REGULAR_FONT_WEIGHT = 600;

export const MONOSPACE_FONT_FAMILY = "GT Planar";
export const MONOSPACE_FONT_WEIGHT = 500;

export const TITLE_FONT_FAMILY = regularFont;
export const TITLE_FONT_WEIGHT = 700;
