import React from "react";
import {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import { Theme } from "../../../config/themes";
import { NoCaptionsPlaceholder } from "../../captions/NoCaptionsPlaceholder";
import { Subs } from "../../captions/Subs";
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
  return (
    <>
      {sceneAndMetadata.layout.subtitleLayout &&
      sceneAndMetadata.cameras.captions ? (
        <WaitForFonts>
          <CaptionOverlay
            file={sceneAndMetadata.cameras.captions}
            theme={theme}
            trimStart={startFrom}
          >
            <Subs
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
      ) : sceneAndMetadata.layout.subtitleLayout ? (
        <NoCaptionsPlaceholder
          layout={sceneAndMetadata.layout.subtitleLayout}
          theme={theme}
        />
      ) : null}
    </>
  );
};
