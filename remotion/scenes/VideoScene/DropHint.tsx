import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { TITLE_FONT } from "../../../config/fonts";
import { COLORS, Theme } from "../../../config/themes";

export const DropHint: React.FC<{
  theme: Theme;
}> = ({ theme }) => {
  const styles: React.CSSProperties = useMemo(() => {
    return {
      backgroundColor: COLORS[theme].BACKGROUND,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 30,
      ...TITLE_FONT,
    };
  }, [theme]);

  return (
    <AbsoluteFill style={styles}>
      Drop images and videos to use as B-Roll
    </AbsoluteFill>
  );
};
