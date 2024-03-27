import type { Word } from "../../config/autocorrect";

type Token = {
  t_dtw: number;
};

export type WhisperWord = {
  offsets: {
    from: number;
    to: number;
  };
  tokens: Token[];
  text: string;
};

export type WhisperOutput = {
  transcription: WhisperWord[];
  result: {
    language: string;
  };
};

export type SubTypes = {
  segments: Segment[];
};

export type Segment = {
  words: Word[];
};

export const whisperWordToWord = (word: WhisperWord): Word => {
  return {
    word: word.text,
    firstTimestamp: (word.tokens[0] as Token).t_dtw * 10,
    lastTimestamp: (word.tokens[word.tokens.length - 1] as Token).t_dtw * 10,
  };
};
