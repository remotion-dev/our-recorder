import React, { useMemo } from "react";
import { TITLE_FONT } from "../../config/fonts";
import { VideoSceneAndMetadata } from "../../config/scenes";
import { COLORS } from "../../config/themes";
import { SingleBRollEdit } from "./SingleBRollEdit";

const DragToAddBRoll: React.FC = () => {
  const style: React.CSSProperties = useMemo(() => {
    return {
      ...TITLE_FONT,
      fontSize: 20,
      color: COLORS.light.WORD_COLOR_ON_BG_GREYED,
      marginTop: 40,
    };
  }, []);

  return <div style={style}>Drag assets to add B-Rolls</div>;
};

const container: React.CSSProperties = {
  marginTop: 40,
};

export const BRollEditor: React.FC<{
  scene: VideoSceneAndMetadata;
  sceneIndex: number;
}> = ({ scene, sceneIndex }) => {
  if (scene.bRolls.length === 0) {
    return <DragToAddBRoll />;
  }

  return (
    <div style={container}>
      {scene.scene.bRolls.map((bRoll, i) => {
        return (
          <SingleBRollEdit
            sceneIndex={sceneIndex}
            bRoll={bRoll}
            key={bRoll.source}
            bRollIndex={i}
          />
        );
      })}
    </div>
  );
};
