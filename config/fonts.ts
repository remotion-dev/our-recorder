import {
  loadFont as loadRegular,
  fontFamily as regularFont,
} from "@remotion/google-fonts/Inter";
import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";

const regular = loadRegular();

// Note: Only Remotion AG is licensed to use this font.
// Don't use it for your videos.
const gtPlanar = "GT Planar";

const gtPlanarRegular =
  typeof document === "undefined"
    ? Promise.resolve()
    : new FontFace(
        "GT Planar",
        `url(${staticFile("gt-planar-regular.woff2")}) format('woff2')`,
        {
          weight: "400",
        },
      )
        .load()
        .then((f) => {
          return f.loaded;
        })
        .then((f) => {
          document.fonts.add(f);
        });
const gtPlanarMedium =
  typeof document === "undefined"
    ? Promise.resolve()
    : new FontFace(
        "GT Planar",
        `url(${staticFile("gt-planar-medium.woff2")}) format('woff2')`,
        { weight: "500" },
      )
        .load()
        .then((f) => {
          return f.loaded;
        })
        .then((f) => {
          document.fonts.add(f);
        });

export const waitForFonts = async () => {
  await regular.waitUntilDone();
  await gtPlanarMedium;
  await gtPlanarRegular;
};

export const REGULAR_FONT_FAMILY = regularFont;
export const REGULAR_FONT_WEIGHT = 600;

export const MONOSPACE_FONT_FAMILY = gtPlanar;
export const MONOSPACE_FONT_WEIGHT = 500;

export const TITLE_FONT_FAMILY = regularFont;
export const TITLE_FONT_WEIGHT = 700;

export const ENDCARD_FONT_FAMILY = gtPlanar;
export const ENDCARD_FONT_WEIGHT = 500;

const delay = delayRender("Loading fonts");

waitForFonts()
  .then(() => continueRender(delay))
  .catch((err) => {
    cancelRender(err);
  });
