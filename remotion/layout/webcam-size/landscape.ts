// TODO: Use this also in the recording interface
const webcamRatio = 400 / 350;

export const getLandscapeWebcamSize = () => {
  const width = 350;

  const height = webcamRatio * width;

  return {
    width,
    height,
  };
};
