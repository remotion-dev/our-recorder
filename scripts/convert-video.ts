import { spawn } from "node:child_process";
import { existsSync, renameSync, unlinkSync } from "node:fs";
import os from "os";
import path from "path";
import { prefixes } from "../src/helpers/prefixes";
import { getDownloadsFolder } from "./get-downloads-folder";
import { parseFfmpegProgress } from "./server/parse-ffmpeg-progress";

export const convertVideo = async ({
  input,
  output,
  onProgress,
  signal,
  expectedFrames,
}: {
  input: string;
  output: string;
  onProgress: (options: {
    framesEncoded: number;
    progress: number;
    filename: string;
  }) => void;
  signal: AbortSignal;
  expectedFrames: number;
}) => {
  const tempFile = path.join(os.tmpdir(), `temp${Math.random()}.mp4`);
  const proc = spawn(
    "bunx",
    [
      "remotion",
      "ffmpeg",
      "-stats_period",
      "0.1",
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
    const framesEncoded = parseFfmpegProgress(d.toString(), 30);

    if (framesEncoded !== undefined) {
      onProgress({
        filename: path.basename(output),
        framesEncoded: framesEncoded,
        progress: framesEncoded / expectedFrames,
      });
    }
  });

  await new Promise((resolve) => proc.on("close", resolve));

  onProgress({
    filename: path.basename(output),
    framesEncoded: expectedFrames,
    progress: 1,
  });

  renameSync(tempFile, output);
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
  expectedFrames,
}: {
  props: ScriptProps | ServerProps;
  onProgress: (options: {
    framesEncoded: number;
    progress: number;
    filename: string;
  }) => void;
  abortSignal: AbortSignal;
  expectedFrames: number;
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
      convertVideo({
        input: src,
        output: path.join(folder, latest.replace(".webm", ".mp4")),
        onProgress,
        signal: abortSignal,
        expectedFrames,
      });
    }
  }
};
