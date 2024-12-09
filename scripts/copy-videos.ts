import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "path";
import { prefixes } from "../src/helpers/prefixes";
import { getDownloadsFolder } from "./get-downloads-folder";

export const copyVideo = ({
  input,
  output,
}: {
  input: string;
  output: string;
}) => {
  if (!existsSync(output)) {
    mkdirSync(path.dirname(output), { recursive: true });
  }
  copyFileSync(input, output);
};

export const copyVideos = ({
  latestTimestamp,
  compositionId,
}: {
  latestTimestamp: number;
  compositionId: string;
}) => {
  const fileLocation = getDownloadsFolder();

  for (const prefix of prefixes) {
    const latest = `${prefix}${latestTimestamp}.mp4`;
    const src = path.join(fileLocation, latest);
    const folder = path.join("public", compositionId);

    if (existsSync(src)) {
      copyVideo({
        input: src,
        output: path.join(folder, latest),
      });
    }
  }
};
