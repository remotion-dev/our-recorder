import React, { useMemo } from "react";
import { Sequence, useVideoConfig } from "remotion";
import { Layout } from "../../layout/layout-types";
import { useCaptions } from "../editor/captions-provider";
import { subtitleLines } from "../srt/helpers/calculate-srt";
import { PortraitLine } from "./PortraitLine";

const MAX_PORTRAIT_CHARS_PER_LINE = 20;

export const PortraitWords: React.FC<{
  startFrame: number;
  webcamLayout: Layout;
}> = ({ startFrame, webcamLayout }) => {
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

        if (durationInFrames === 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            durationInFrames={durationInFrames}
            from={from}
            showInTimeline={false}
            layout="none"
          >
            <PortraitLine segment={segment} webcamLayout={webcamLayout} />
          </Sequence>
        );
      })}
    </>
  );
};
