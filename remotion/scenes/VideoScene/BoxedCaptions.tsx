import React from "react";
import {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import { Theme } from "../../../config/themes";
import { AnimatedCaptions } from "../../captions/AnimatedCaptions";
import { NoCaptionsPlaceholder } from "../../captions/NoCaptionsPlaceholder";
import { CaptionOverlay } from "../../captions/editor/CaptionOverlay";
import { WaitForFonts } from "../../helpers/WaitForFonts";

export const BoxedCaptions: React.FC<{
  sceneAndMetadata: VideoSceneAndMetadata;
  theme: Theme;
  startFrom: number;
  enterProgress: number;
  exitProgress: number;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
}> = ({
  sceneAndMetadata,
  theme,
  enterProgress,
  exitProgress,
  nextScene,
  previousScene,
  startFrom,
}) => {
  if (!sceneAndMetadata.layout.subtitleLayout) {
    return null;
  }

  if (sceneAndMetadata.cameras.captions) {
    return (
      <WaitForFonts>
        <CaptionOverlay
          file={sceneAndMetadata.cameras.captions}
          theme={theme}
          trimStart={startFrom}
        >
          <AnimatedCaptions
            trimStart={startFrom}
            enterProgress={enterProgress}
            exitProgress={exitProgress}
            scene={sceneAndMetadata}
            nextScene={nextScene}
            previousScene={previousScene}
            theme={theme}
            subtitleLayout={sceneAndMetadata.layout.subtitleLayout}
          />
        </CaptionOverlay>
      </WaitForFonts>
    );
  }

  if (sceneAndMetadata.layout.subtitleLayout) {
    return (
      <NoCaptionsPlaceholder
        layout={sceneAndMetadata.layout.subtitleLayout}
        theme={theme}
      />
    );
  }

  return null;
};
