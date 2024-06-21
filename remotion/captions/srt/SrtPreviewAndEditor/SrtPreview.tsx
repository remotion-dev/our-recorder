import React, { useMemo } from "react";
import { Sequence, useVideoConfig } from "remotion";
import { useCaptions } from "../../editor/captions-provider";
import { postprocessCaptions } from "../../processing/postprocess-subs";
import { calculateSrt } from "../helpers/calculate-srt";
import { SrtPreviewLine } from "./SrtPreviewLine";

export const SrtPreview: React.FC<{
  startFrame: number;
}> = ({ startFrame }) => {
  const { fps } = useVideoConfig();
  const captions = useCaptions();

  const words = useMemo(() => {
    return postprocessCaptions({ subTypes: captions });
  }, [captions]);
  const srt = calculateSrt({ words, actualStartFrame: startFrame });

  return (
    <>
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
            layout="none"
          >
            <SrtPreviewLine segment={segment} />
          </Sequence>
        );
      })}
    </>
  );
};
