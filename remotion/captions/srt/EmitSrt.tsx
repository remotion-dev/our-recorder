import React from "react";
import { Artifact, useCurrentFrame } from "remotion";

// Rendering this component will cause an captions.srt file to be generated
// while rendering.
export const EmitSrt: React.FC<{
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
