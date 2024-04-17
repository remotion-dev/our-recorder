import { staticFile } from "remotion";
import type { BRoll } from "../../../config/scenes";

export const sampleBRolls: BRoll[] = [
  {
    source: staticFile("test/Marathon.png"),
    durationInFrames: 300,
    from: 30,
  },
  {
    source: staticFile("test/vegas.jpg"),
    durationInFrames: 60,
    from: 20,
  },
];
