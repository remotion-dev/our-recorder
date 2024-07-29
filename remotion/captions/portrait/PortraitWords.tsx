import React, { useMemo } from "react";
import { Sequence, useVideoConfig } from "remotion";
import { useCaptions } from "../editor/captions-provider";
import { SrtPreviewLine } from "../srt/SrtPreviewAndEditor/SrtPreviewLine";
import { subtitleLines } from "../srt/helpers/calculate-srt";

const MAX_PORTRAIT_CHARS_PER_LINE = 30;

export const PortraitWords: React.FC<{
  startFrame: number;
}> = ({ startFrame }) => {
  const { fps } = useVideoConfig();
  const captions = useCaptions();

  const lines = useMemo(() => {
    return subtitleLines({
      whisperCppOutput: captions,
      startFrame,
      maxCharsPerLine: MAX_PORTRAIT_CHARS_PER_LINE,
    });
  }, [captions, startFrame]);

  return (
    <>
      {lines.map((segment, index) => {
        const durationInFrames =
          ((segment.lastTimestamp - segment.firstTimestamp) / 1000) * fps;
        const from = (segment.firstTimestamp / 1000) * fps;

        return (
          <Sequence
            key={index}
            durationInFrames={durationInFrames}
            from={from}
            showInTimeline={false}
            layout="none"
          >
            <SrtPreviewLine segment={segment} />
          </Sequence>
        );
      })}
    </>
  );
};
