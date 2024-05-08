import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import { waitForFonts } from "../../config/fonts";

export const WaitForFonts: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    const delay = delayRender("Waiting for fonts to be loaded");

    waitForFonts()
      .then(() => {
        continueRender(delay);
        setFontsLoaded(true);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [fontsLoaded, handle]);

  if (!fontsLoaded) {
    return null;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
