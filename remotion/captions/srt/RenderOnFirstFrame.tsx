import React from "react";
import { Artifact } from "remotion";

export const RenderOnFirstFrame: React.FC<{
  srtFile: string | null;
}> = ({ srtFile }) => {
  return (
    <>{srtFile && <Artifact content={srtFile} filename="captions.srt" />}</>
  );
};
