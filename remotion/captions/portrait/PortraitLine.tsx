import React, { useMemo } from "react";
import { Layout } from "../../layout/layout-types";
import { ClickableWord } from "../srt/SrtPreviewAndEditor/ClickableWord";
import { UnserializedSrt } from "../srt/helpers/serialize-srt";

const FONT_SIZE = 80;

const inner: React.CSSProperties = {
  color: "white",
  fontFamily: "Helvetica, Arial, sans-serif",
  pointerEvents: "unset",
  fontSize: FONT_SIZE,
  position: "absolute",
  fontWeight: 700,
  WebkitTextStroke: "20px black",
  paintOrder: "stroke",
  filter: "drop-shadow(0 1px 40px rgba(255, 255, 255, 0.5))",
};

export const PortraitLine: React.FC<{
  segment: UnserializedSrt;
  webcamLayout: Layout;
}> = ({ segment, webcamLayout }) => {
  const container: React.CSSProperties = useMemo(() => {
    return {
      alignItems: "center",
      position: "absolute",
      top: webcamLayout.top - FONT_SIZE / 2,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      height: FONT_SIZE,
      lineHeight: 1,
    };
  }, [webcamLayout.top]);

  return (
    <div style={container}>
      <div style={inner}>
        {segment.words.map((word) => {
          return (
            <span key={word.firstTimestamp}>
              <ClickableWord word={word}></ClickableWord>
            </span>
          );
        })}
      </div>
    </div>
  );
};
