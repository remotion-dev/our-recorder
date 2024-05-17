import { StaticFile, getStaticFiles } from "remotion";
import {
  ALTERNATIVE1_PREFIX,
  ALTERNATIVE2_PREFIX,
  DISPLAY_PREFIX,
  SUBS_PREFIX,
  WEBCAM_PREFIX,
} from "../../config/cameras";
import { Cameras } from "../../config/scenes";

export const getCameras = (prefix: string) => {
  const files = getStaticFiles().filter((f) => f.name.startsWith(prefix));

  const mapFile = (file: StaticFile): Cameras | null => {
    if (!file.name.startsWith(`${prefix}/${WEBCAM_PREFIX}`)) {
      return null;
    }

    const timestamp = file.name
      .toLowerCase()
      .replace(`${prefix}/${WEBCAM_PREFIX}`, "")
      .replace(".webm", "")
      .replace(".mov", "")
      .replace(".mp4", "");

    const display = files.find((_f) =>
      _f.name.startsWith(`${prefix}/${DISPLAY_PREFIX}${timestamp}.`),
    );
    const sub = files.find((_f) =>
      _f.name.startsWith(`${prefix}/${SUBS_PREFIX}${timestamp}.`),
    );
    const alternative1 = files.find((_f) =>
      _f.name.startsWith(`${prefix}/${ALTERNATIVE1_PREFIX}${timestamp}.`),
    );
    const alternative2 = files.find((_f) =>
      _f.name.startsWith(`${prefix}/${ALTERNATIVE2_PREFIX}${timestamp}.`),
    );

    return {
      webcam: file,
      display: display ?? null,
      subs: sub ?? null,
      alternative1: alternative1 ?? null,
      alternative2: alternative2 ?? null,
      timestamp: parseInt(timestamp, 10),
    };
  };

  const mappedCameras = files.map(mapFile).filter(Boolean) as Cameras[];

  return mappedCameras.sort((a, b) => a.timestamp - b.timestamp);
};
