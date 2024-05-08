import type { WhisperWord } from "../types";

const removeBlankSubTokens = (
  token: WhisperWord["tokens"],
): WhisperWord["tokens"] => {
  return token.filter((t) => !t.text.match(/_TT_/));
};

export const removeBlankTokens = (tokens: WhisperWord[]): WhisperWord[] => {
  return tokens.map((t) => {
    return {
      ...t,
      tokens: removeBlankSubTokens(t.tokens),
    };
  });
};
