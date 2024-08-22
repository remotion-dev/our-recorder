import { FPS } from "../../../../config/fps";
import { joinBackticks } from "../../processing/join-backticks";
import { postprocessCaptions } from "../../processing/postprocess-subs";
import { segmentWords } from "../../processing/segment-words";
import { WhisperCppOutput } from "../../types";
import { UnserializedSrt } from "./serialize-srt";

export const subtitleLines = ({
  startFrame,
  whisperCppOutput,
  maxCharsPerLine,
}: {
  whisperCppOutput: WhisperCppOutput;
  startFrame: number;
  maxCharsPerLine: number;
}) => {
  const postprocessed = joinBackticks(postprocessCaptions(whisperCppOutput));
  const segments = segmentWords(postprocessed, maxCharsPerLine);

  const srtSegments: UnserializedSrt[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (!segment) {
      throw new Error(`Segment with index ${i} is undefined`);
    }

    const firstSegment = segment[0];
    const lastSegment = segment[segment.length - 1];

    if (!firstSegment) {
      throw new Error("lastSegment is undefined");
    }
    if (!lastSegment) {
      throw new Error("lastSegment is undefined");
    }

    const offset = -(startFrame / FPS) * 1000;

    const firstTimestamp = Math.round(firstSegment.firstTimestamp + offset);
    if (lastSegment.lastTimestamp === null) {
      throw new Error("Cannot serialize .srt file: lastTimestamp is null");
    }

    const lastTimestamp = lastSegment.lastTimestamp + offset;

    const unserialized: UnserializedSrt = {
      firstTimestamp,
      lastTimestamp,
      text: segment
        .map((s) => s.text.trim())
        .join(" ")
        .trim(),
      words: segment,
    };
    srtSegments.push(unserialized);
  }

  return srtSegments;
};
