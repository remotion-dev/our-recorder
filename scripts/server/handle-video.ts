import type { Request, Response } from "express";
import fs, { createWriteStream } from "fs";
import os from "os";
import path from "path";
import { convertAndRemoveSilence } from "../convert-video";
import { makeStreamPayload } from "./streaming";

export const handleVideoUpload = async (req: Request, res: Response) => {
  try {
    const { prefix, endDateAsString, folder } = req.query;

    if (typeof prefix !== "string") {
      throw new Error("No `prefix` provided");
    }

    if (typeof endDateAsString !== "string") {
      throw new Error("No `endDate` provided");
    }

    if (typeof folder !== "string") {
      throw new Error("No `folder` provided");
    }

    const file = `${prefix}${endDateAsString}.mp4`;

    const folderPath = path.join(process.cwd(), "public", folder);
    const filePath = path.join(folderPath, file);
    const input = path.join(os.tmpdir(), Math.random() + ".webm");

    fs.mkdirSync(path.dirname(input), { recursive: true });
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const writeStream = createWriteStream(input);

    req.pipe(writeStream);

    await new Promise((resolve) => writeStream.on("finish", resolve));

    await convertAndRemoveSilence({
      input: input,
      output: filePath,
      onProgress: (progress) => {
        const payload = makeStreamPayload({
          message: {
            type: "converting-progress",
            payload: {
              framesConverted: progress,
            },
          },
        });
        res.write(payload);
      },
    });

    res.statusCode = 200;
    res.end();
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: (e as Error).message }));
  }
};
