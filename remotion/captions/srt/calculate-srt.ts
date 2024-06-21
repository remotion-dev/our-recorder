import { Word } from "../../../config/autocorrect";
import { FPS } from "../../../config/fps";

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

const formatSingleSrtTimestamp = (timestamp: number) => {
  const hours = Math.floor(timestamp / 3600000);
  const minutes = Math.floor((timestamp % 3600000) / 60000);
  const seconds = Math.floor((timestamp % 60000) / 1000);
  const milliseconds = Math.floor(timestamp % 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
};

const formatSrtTimestamp = (startMs: number, endMs: number) => {
  return `${formatSingleSrtTimestamp(startMs)} --> ${formatSingleSrtTimestamp(endMs)}`;
};

export type UnserializedSrt = {
  firstTimestamp: number;
  lastTimestamp: number;
  text: string;
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

type SrtsToCombine = {
  offsetInMs: number;
  srts: UnserializedSrt[];
};

export const combineSrt = (srt: SrtsToCombine[]): UnserializedSrt[] => {
  return srt
    .map((line) => {
      return line.srts.map((s): UnserializedSrt => {
        return {
          text: s.text,
          firstTimestamp: s.firstTimestamp + line.offsetInMs,
          lastTimestamp: s.lastTimestamp + line.offsetInMs,
        };
      });
    })
    .flat(1);
};

export const serializeSrt = (srt: UnserializedSrt[]) => {
  let currentIndex = 0;

  return srt
    .map((s) => {
      currentIndex++;
      return [
        // Index
        currentIndex,
        formatSrtTimestamp(s.firstTimestamp, s.lastTimestamp),
        // Text
        s.text,
      ].join("\n");
    })
    .join("\n\n");
};
