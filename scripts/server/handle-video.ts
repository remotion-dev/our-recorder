import fs, { createWriteStream } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import os from "os";
import path from "path";
import { convertVideo } from "../convert-video";
import { makeStreamPayload } from "./streaming";
import { transcribeVideo } from "./transcribe-video";

export const handleVideoUpload = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url as string;
  const params = new URLSearchParams(url.substring(1));
  const endDateAsString = params.get("endDateAsString");
  const folder = params.get("folder");
  const prefix = params.get("prefix");
  try {
    if (typeof prefix !== "string") {
      throw new Error("No `prefix` provided");
    }

    if (typeof endDateAsString !== "string") {
      throw new Error("No `endDate` provided");
    }

    if (typeof folder !== "string") {
      throw new Error("No `folder` provided");
    }

    // TODO: does not work
    const controller = new AbortController();

    res.socket?.on("close", () => {
      controller.abort();

      console.log("REY has closed the connection or tab.");
    });

    const file = `${prefix}${endDateAsString}.mp4`;

    const publicDir = path.join(process.cwd(), "public");
    const folderPath = path.join(publicDir, folder);
    const filePath = path.join(folderPath, file);
    const input = path.join(os.tmpdir(), Math.random() + ".webm");

    fs.mkdirSync(path.dirname(input), { recursive: true });
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const writeStream = createWriteStream(input);

    req.pipe(writeStream);

    await new Promise((resolve) => writeStream.on("finish", resolve));

    await convertVideo({
      input: input,
      output: filePath,
      onProgress: (progress) => {
        const payload = makeStreamPayload({
          message: {
            type: "converting-progress",
            payload: {
              framesConverted: progress,
              prefix,
            },
          },
        });
        res.write(payload);
      },
      signal: controller.signal,
    });

    await transcribeVideo({
      endDateAsString,
      folder,
      publicDir,
      onProgress: (status) => {
        const payload = makeStreamPayload({
          message: {
            type: "transcribing-progress",
            payload: {
              statusMessage: status,
            },
          },
        });
        res.write(payload);
      },
      signal: controller.signal,
    });

    res.statusCode = 200;
    res.end();
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: (e as Error).message }));
  }
};
