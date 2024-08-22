import { Word } from "../../../config/autocorrect";

export const segmentWords = (word: Word[], maxCharsPerLine: number) => {
  const segments: Word[][] = [];
  let currentSegment: Word[] = [];

  for (let i = 0; i < word.length; i++) {
    const w = word[i] as Word;
    const remainingWords = word.slice(i + 1);
    const filledCharactersInLine = currentSegment
      .map((s) => s.text.length)
      .reduce((a, b) => a + b, 0);

    const preventOrphanWord =
      remainingWords.length < 4 &&
      remainingWords.length > 1 &&
      filledCharactersInLine > maxCharsPerLine / 2;

    if (
      filledCharactersInLine + w.text.length > maxCharsPerLine ||
      preventOrphanWord
    ) {
      segments.push(currentSegment);
      currentSegment = [];
    }
    currentSegment.push(w);
  }

  segments.push(currentSegment);
  return segments;
};
