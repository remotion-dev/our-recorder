import { StaticFile } from "@remotion/studio";
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Theme } from "../../../../config/themes";
import { CaptionOverlay } from "../../editor/CaptionOverlay";
import { UnserializedSrt } from "../helpers/serialize-srt";
import { SrtPreviewLine } from "./SrtPreviewLine";

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
              <SrtPreviewLine text={segment.text} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </CaptionOverlay>
  );
};
