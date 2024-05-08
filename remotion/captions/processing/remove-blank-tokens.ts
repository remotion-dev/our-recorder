import type { WhisperWord } from "../types";
import { removeWhisperBlankWords } from "./postprocess-subs";

export const removeBlankTokens = (tokens: WhisperWord[]): WhisperWord[] => {
  return removeWhisperBlankWords(tokens).filter((t) => t.text.trim() !== "");
};
