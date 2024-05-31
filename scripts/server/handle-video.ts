import type { Request, Response } from "express";
import fs, { createWriteStream } from "fs";
import path from "path";
import { convertAndRemoveSilence } from "../convert-video";

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

    const file = `${prefix}${endDateAsString}.webm`;

    const folderPath = path.join(process.cwd(), "public", folder);
    const filePath = path.join(folderPath, file);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const writeStream = createWriteStream(filePath);

    req.pipe(writeStream);

    await new Promise((resolve) => writeStream.on("finish", resolve));

    convertAndRemoveSilence({
      input: filePath,
      output: filePath.replace(".webm", ".mp4"),
    });

    req.on("end", () => {
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
    });
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: (e as Error).message }));
  }
};
