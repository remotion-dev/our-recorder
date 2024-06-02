import { spawn } from "node:child_process";
import { existsSync, renameSync, unlinkSync } from "node:fs";
import os from "os";
import path from "path";
import { prefixes } from "../src/helpers/prefixes";
import { getDownloadsFolder } from "./get-downloads-folder";
import { checkVideoIntegrity } from "./server/check-video-integrity";
import { parseFfmpegProgress } from "./server/parse-ffmpeg-progress";

export const convertAndRemoveSilence = async ({
  input,
  output,
  onProgress,
  signal,
}: {
  input: string;
  output: string;
  onProgress: (progress: number) => void;
  signal: AbortSignal;
}) => {
  const tempFile = path.join(os.tmpdir(), `temp${Math.random()}.mp4`);
  const proc = spawn(
    "bunx",
    [
      "remotion",
      "ffmpeg",
      "-hide_banner",
      "-i",
      input,
      "-movflags",
      "+faststart",
      "-r",
      "30",
      "-y",
      tempFile,
    ],
    {
      signal,
    },
  );

  proc.stderr.on("data", (d) => {
    const progress = parseFfmpegProgress(d.toString(), 30);
    if (progress) {
      onProgress(progress);
    }
  });

  await new Promise((resolve) => proc.on("close", resolve));

  renameSync(tempFile, output);
  checkVideoIntegrity(output);
  unlinkSync(input);
};

type ScriptProps = {
  caller: "script";
  latestTimestamp: number;
  prefix: string;
};

type ServerProps = {
  caller: "server";
  latestTimestamp: number;
  customFileLocation: string;
};

export const convertVideos = async ({
  props,
  onProgress,
  abortSignal,
}: {
  props: ScriptProps | ServerProps;
  onProgress: (progress: number) => void;
  abortSignal: AbortSignal;
}) => {
  const { latestTimestamp, caller } = props;

  let fileLocation;
  if (props.caller === "server") {
    fileLocation = props.customFileLocation;
  } else {
    fileLocation = getDownloadsFolder();
  }

  for (const prefix of prefixes) {
    const latest = `${prefix}${latestTimestamp}.webm`;
    const src = path.join(fileLocation, latest);
    const folder =
      caller === "server"
        ? props.customFileLocation
        : path.join("public", props.prefix);

    if (existsSync(src)) {
      convertAndRemoveSilence({
        input: src,
        output: path.join(folder, latest.replace(".webm", ".mp4")),
        onProgress,
        signal: abortSignal,
      });
    }
  }
};
