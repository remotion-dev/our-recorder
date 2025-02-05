import React, { useImperativeHandle } from "react";
import { useCaptionOverlay } from "./use-caption-overlay";

export type CaptionsRef = {
  open: () => void;
};

export const captionsRef = React.createRef<CaptionsRef>();

export const OpenCaptionEditorExternally = () => {
  const { hasContext, setOpen } = useCaptionOverlay();

  useImperativeHandle(
    captionsRef,
    () => ({
      open: () => {
        if (!hasContext) {
          return;
        }

        setOpen(true);
      },
    }),
    [hasContext, setOpen],
  );

  return null;
};
