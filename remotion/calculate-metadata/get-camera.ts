import { StaticFile, getStaticFiles } from "remotion";
import {
  ALTERNATIVE1_PREFIX,
  ALTERNATIVE2_PREFIX,
  CAPTIONS_PREFIX,
  DISPLAY_PREFIX,
  WEBCAM_PREFIX,
} from "../../config/cameras";
import { Cameras } from "../../config/scenes";

const findMatchingFile = ({
  files,
  compositionId,
  prefix,
  timestamp,
}: {
  files: StaticFile[];
  compositionId: string;
  prefix: string;
  timestamp: string;
}): StaticFile | null => {
  const sub = files.find((_f) =>
    _f.name.startsWith(`${compositionId}/${prefix}${timestamp}.`),
  );

  return sub ?? null;
};

const mapFile = (
  file: StaticFile,
  files: StaticFile[],
  compositionId: string,
): Cameras | null => {
  if (!file.name.startsWith(`${compositionId}/${WEBCAM_PREFIX}`)) {
    return null;
  }

  const timestamp = file.name
    .toLowerCase()
    .replace(`${compositionId}/${WEBCAM_PREFIX}`, "")
    .replace(".webm", "")
    .replace(".mov", "")
    .replace(".mp4", "");

  const display = findMatchingFile({
    files,
    compositionId,
    prefix: DISPLAY_PREFIX,
    timestamp,
  });
  const sub = findMatchingFile({
    files,
    compositionId,
    prefix: CAPTIONS_PREFIX,
    timestamp,
  });
  const alternative1 = findMatchingFile({
    files,
    compositionId,
    prefix: ALTERNATIVE1_PREFIX,
    timestamp,
  });
  const alternative2 = findMatchingFile({
    compositionId,
    files,
    prefix: ALTERNATIVE2_PREFIX,
    timestamp,
  });

  return {
    webcam: file,
    display: display ?? null,
    captions: sub ?? null,
    alternative1: alternative1 ?? null,
    alternative2: alternative2 ?? null,
    timestamp: parseInt(timestamp, 10),
  };
};

export const getCameras = (compositionId: string) => {
  const files = getStaticFiles().filter((f) =>
    f.name.startsWith(compositionId),
  );

  const mappedCameras = files
    .map((f) => mapFile(f, files, compositionId))
    .filter(Boolean) as Cameras[];

  return mappedCameras.sort((a, b) => a.timestamp - b.timestamp);
};
