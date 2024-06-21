import { Word } from "../../../../config/autocorrect";
import { FPS } from "../../../../config/fps";
import { UnserializedSrt } from "./serialize-srt";

// The SRT standard recommends not more than 42 characters per line

const MAX_CHARS_PER_LINE = 42;

const segmentWords = (word: Word[]) => {
  const segments: Word[][] = [];
  let currentSegment: Word[] = [];
  for (const w of word) {
    if (
      currentSegment.map((s) => s.text.length).reduce((a, b) => a + b, 0) +
        w.text.length >
      MAX_CHARS_PER_LINE
    ) {
      segments.push(currentSegment);
      currentSegment = [];
    }
    currentSegment.push(w);
  }
  segments.push(currentSegment);
  return segments;
};

export const calculateSrt = ({
  actualStartFrame,
  words,
}: {
  words: Word[];
  actualStartFrame: number;
}) => {
  const segments = segmentWords(words);

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

    const firstTimestamp = Math.round(
      firstSegment.firstTimestamp - (actualStartFrame / FPS) * 1000,
    );
    // TODO: Can be null! Need to handle
    const lastTimestamp = lastSegment.lastTimestamp as number;

    const unserialized: UnserializedSrt = {
      firstTimestamp,
      lastTimestamp,
      text: segment
        .map((s) => s.text)
        .join(" ")
        .trim(),
    };
    srtSegments.push(unserialized);
  }
  return srtSegments;
};
