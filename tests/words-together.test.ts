// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import { expect, test } from "bun:test";
import type { Word } from "../config/autocorrect";
import { wordsTogether } from "../remotion/captions/processing/words-together";

const example: Word[] = [
  {
    word: " `bun`",
    start: 5.42,
    end: 5.94,
    timestamp: 0,
  },
  {
    word: " `run`",
    start: 5.94,
    end: 6.54,
    timestamp: 0,
  },
  {
    word: " `dev`",
    start: 6.54,
    end: 6.96,
    timestamp: 0,
  },
  {
    word: ". It",
    start: 7.76,
    end: 8.36,
    timestamp: 0,
  },
  {
    word: " looks",
    start: 8.36,
    end: 8.62,
    timestamp: 0,
  },
];

test("join words correctly", () => {
  const words = wordsTogether(example);
  expect(words).toEqual([
    {
      end: 5.94,
      start: 5.42,
      word: " `bun`",
      timestamp: 0,
    },
    {
      end: 6.54,
      start: 5.94,
      word: " `run`",
      timestamp: 0,
    },
    {
      start: 6.54,
      end: 6.96,
      word: " `dev`.",
      timestamp: 0,
    },
    {
      end: 8.36,
      start: 7.76,
      word: " It",
      timestamp: 0,
    },
    {
      end: 8.62,
      start: 8.36,
      word: " looks",
      timestamp: 0,
    },
  ]);
});
