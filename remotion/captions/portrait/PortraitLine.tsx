import React, { useMemo } from "react";
import { Layout } from "../../layout/layout-types";
import { SrtSingleWord } from "../srt/SrtPreviewAndEditor/SingleWord";
import { UnserializedSrt } from "../srt/helpers/serialize-srt";

const FONT_SIZE = 80;

const inner: React.CSSProperties = {
  color: "white",
  fontFamily: "Helvetica, Arial, sans-serif",
  pointerEvents: "unset",
  fontSize: FONT_SIZE,
  position: "absolute",
  fontWeight: 700,
  WebkitTextStroke: "10px black",
  paintOrder: "stroke",
  textShadow: "0 20px 40px black",
};

export const PortraitLine: React.FC<{
  segment: UnserializedSrt;
  webcamLayout: Layout;
}> = ({ segment, webcamLayout }) => {
  const container: React.CSSProperties = useMemo(() => {
    return {
      alignItems: "center",
      position: "absolute",
      top: webcamLayout.top + 50,
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
            <SrtSingleWord
              word={word}
              key={word.firstTimestamp}
            ></SrtSingleWord>
          );
        })}
      </div>
    </div>
  );
};
