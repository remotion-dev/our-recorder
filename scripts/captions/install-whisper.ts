import {
  downloadWhisperModel,
  installWhisperCpp,
} from "@remotion/install-whisper-cpp";
import { WHISPER_MODEL, WHISPER_PATH } from "../../config/whisper";

export const ensureWhisper = async () => {
  await installWhisperCpp({
    to: WHISPER_PATH,
    version: "9fab28135c7867bb7eccd9ebcd2ea8d52e42ca81",
    printOutput: true,
  });
  await downloadWhisperModel({
    model: WHISPER_MODEL,
    folder: WHISPER_PATH,
    printOutput: true,
  });
};
