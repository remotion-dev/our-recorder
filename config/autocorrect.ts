export type Word = {
  text: string;
  firstTimestamp: number;
  lastTimestamp: number | null;
  monospace?: boolean;
};

export const autocorrectWord = (word: Word): Word => {
  if (word.text === " github") {
    return {
      ...word,
      text: " GitHub",
    };
  }

  if (word.text === " BUN") {
    return {
      ...word,
      text: " Bun",
    };
  }

  if (word.text === " javascript") {
    return {
      ...word,
      text: " JavaScript",
    };
  }

  if (word.text.includes(" Algorra")) {
    return {
      ...word,
      text: word.text.replace(" Algorra", " Algora"),
    };
  }

  if (word.text.match(/ remotion\.$/)) {
    return {
      ...word,
      text: word.text.replace(/ remotion.$/, " Remotion."),
    };
  }

  return {
    ...word,
    text: word.text
      .replace(" ReMotion", " Remotion")
      .replace(" Monorepo", " monorepo")
      .replace(" rust.", " Rust."),
  };
};

export const autocorrectWords = (words: Word[]): Word[] => {
  return words.map(autocorrectWord);
};
