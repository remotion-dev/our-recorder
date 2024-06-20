import React from "react";
import { Artifact, useCurrentFrame } from "remotion";

export const RenderOnFirstFrame: React.FC<{
  srtFile: string | null;
}> = ({ srtFile }) => {
  const frame = useCurrentFrame();
  if (!srtFile) {
    return null;
  }

  if (frame !== 0) {
    return null;
  }

  return <Artifact content={srtFile} filename="captions.srt" />;
};
