import { StaticFile } from "@remotion/studio";
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Theme } from "../../../config/themes";
import { CaptionOverlay } from "../editor/CaptionOverlay";
import { UnserializedSrt } from "./helpers/serialize-srt";

const Text: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        fontSize: 48,
        paddingBottom: 50,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "12px 15px",
          color: "white",
          fontFamily: "Helvetica, Arial, sans-serif",
          pointerEvents: "unset",
          borderRadius: 10,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const SrtPreview: React.FC<{
  srt: UnserializedSrt[];
  captions: StaticFile;
  startFrom: number;
  theme: Theme;
}> = ({ srt, captions, startFrom, theme }) => {
  const { fps } = useVideoConfig();

  return (
    <CaptionOverlay file={captions} theme={theme} trimStart={startFrom}>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {srt.map((segment, index) => {
          // TODO: Should by default have a minimum duration

          const durationInFrames = Math.max(
            1,
            ((segment.lastTimestamp - segment.firstTimestamp) / 1000) * fps,
          );
          const from = (segment.firstTimestamp / 1000) * fps;

          return (
            <Sequence
              key={index}
              durationInFrames={durationInFrames}
              from={from}
              showInTimeline={false}
              style={{
                pointerEvents: "none",
              }}
            >
              <Text text={segment.text} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </CaptionOverlay>
  );
};
