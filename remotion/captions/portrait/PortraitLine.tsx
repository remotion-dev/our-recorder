import React, { useMemo } from "react";
import {
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Layout } from "../../layout/layout-types";
import { ClickableWord } from "../srt/SrtPreviewAndEditor/ClickableWord";
import { UnserializedSrt } from "../srt/helpers/serialize-srt";

const FONT_SIZE = 80;

const inner: React.CSSProperties = {
  fontFamily: "Helvetica, Arial, sans-serif",
  pointerEvents: "unset",
  position: "absolute",
  fontWeight: 700,
  WebkitTextStroke: "20px black",
  paintOrder: "stroke",
  filter: "drop-shadow(0 1px 40px rgba(255, 255, 255, 0.5))",
};

export const PortraitLine: React.FC<{
  segment: UnserializedSrt;
  webcamLayout: Layout;
  startFrame: number;
}> = ({ segment, webcamLayout, startFrame }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const container: React.CSSProperties = useMemo(() => {
    return {
      alignItems: "center",
      position: "absolute",
      top: webcamLayout.top - FONT_SIZE / 2,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      height: FONT_SIZE,
      lineHeight: 1,
    };
  }, [webcamLayout.top]);

  return (
    <div style={container}>
      <div style={inner}>
        {segment.words.map((word) => {
          const start = (word.firstTimestamp / 1000) * fps - startFrame - 8;
          const end =
            ((word.lastTimestamp ?? word.firstTimestamp + 500) / 1000) * fps -
            startFrame -
            8;

          const progress =
            spring({
              fps,
              frame,
              config: {
                damping: 200,
              },
              durationInFrames: 15,
              delay: start,
            }) -
            spring({
              fps,
              frame,
              config: {
                damping: 200,
              },
              durationInFrames: 5,
              delay: end,
            });
          const color = interpolateColors(progress, [0, 1], ["#ddd", "white"]);
          const fontSize = interpolate(
            progress,
            [0, 1],
            [FONT_SIZE * 0.7, FONT_SIZE],
          );

          return (
            <span
              key={word.firstTimestamp}
              style={{
                display: "inline-block",
                fontSize,
                whiteSpace: "pre",
                color,
              }}
            >
              <ClickableWord word={word}></ClickableWord>
            </span>
          );
        })}
      </div>
    </div>
  );
};
