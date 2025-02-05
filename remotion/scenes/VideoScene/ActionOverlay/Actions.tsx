import React, { useMemo } from "react";
import { Cameras } from "../../../../config/scenes";
import { DeleteRecordingAction } from "./DeleteRecordingAction";

export const Actions: React.FC<{
  cameras: Cameras;
  sceneIndex: number;
}> = ({ cameras, sceneIndex }) => {
  const style: React.CSSProperties = useMemo(() => {
    return { width: "100%" };
  }, []);

  return (
    <div style={style}>
      <DeleteRecordingAction sceneIndex={sceneIndex} cameras={cameras} />
    </div>
  );
};
