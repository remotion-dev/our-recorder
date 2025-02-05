import { Caption } from "@remotion/captions";
import React, { useContext } from "react";

type CaptionOverlayContext = {
  open: Caption | boolean;
  hasContext: boolean;
  setOpen: React.Dispatch<React.SetStateAction<Caption | boolean>>;
};

const context = React.createContext<CaptionOverlayContext>({
  open: false,
  hasContext: false,
  setOpen: () => {
    throw new Error("React Context not initialized");
  },
});

export const useCaptionOverlay = () => {
  const ctx = useContext(context);
  return ctx;
};

export const CaptionOverlayProvider: React.FC<{
  children: React.ReactNode;
  state: CaptionOverlayContext;
}> = ({ children, state }) => {
  return <context.Provider value={state}>{children}</context.Provider>;
};
