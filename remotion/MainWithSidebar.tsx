import React, { useMemo } from "react";
import {
  AbsoluteFill,
  getRemotionEnvironment,
  Sequence,
  useVideoConfig,
} from "remotion";
import { Main, MainProps } from "./Main";
import { Sidebar } from "./sidebar/Sidebar";

export const getSidebarWidth = () => {
  return getRemotionEnvironment().isStudio ? 400 : 0;
};

export const MainWithSidebar: React.FC<MainProps> = (props) => {
  const { width } = useVideoConfig();

  const sidebarWidth = getSidebarWidth();

  const sidebarStyle: React.CSSProperties = useMemo(() => {
    return {
      width: sidebarWidth,
      left: width - sidebarWidth,
    };
  }, [sidebarWidth, width]);

  return (
    <AbsoluteFill
      style={{
        background: "black",
      }}
    >
      <Sequence width={width - sidebarWidth}>
        <Main {...props} />
      </Sequence>
      <AbsoluteFill style={sidebarStyle}>
        <Sidebar scenesAndMetadata={props.scenesAndMetadata} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
