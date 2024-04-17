import { staticFile } from "remotion";

export type BRollScene = {
  from: number;
  durationInFrames: number;
  source: string;
  assetWidth: number;
  assetHeight: number;
};

export const sampleBRolls: BRollScene[] = [
  {
    source: staticFile("test/Marathon.png"),
    durationInFrames: 300,
    from: 30,
    assetWidth: 3840,
    assetHeight: 2160,
  },
  {
    source: staticFile("test/vegas.jpg"),
    durationInFrames: 60,
    from: 20,
    assetWidth: 3840,
    assetHeight: 2160,
  },
];
