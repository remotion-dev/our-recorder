import { parseMedia, ParseMediaResult } from "@remotion/media-parser";

type Result = ParseMediaResult<{
  slowDurationInSeconds: true;
  dimensions: true;
}>;

const cache = new Map<string, Result>();

export const getMetadataFromSource = async (src: string): Promise<Result> => {
  if (cache.has(src)) {
    return Promise.resolve(cache.get(src) as Result);
  }

  const result: Result = await parseMedia({
    acknowledgeRemotionLicense: true,
    src,
    fields: {
      slowDurationInSeconds: true,
      dimensions: true,
    },
  });

  cache.set(src, result);
  return result;
};
