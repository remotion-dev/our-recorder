import { makeStreamer } from "@remotion/streaming";
import { UPLOAD_VIDEO } from "../../scripts/server/constants";
import {
  MessageTypeId,
  StreamingMessage,
  formatMap,
  messageTypeIdToMessageType,
} from "../../scripts/server/streaming";

const parseJsonOrThrowSource = (data: Uint8Array, type: string) => {
  const asString = new TextDecoder("utf-8").decode(data);
  try {
    return JSON.parse(asString);
  } catch (err) {
    throw new Error(`Invalid JSON (${type}): ${asString}`);
  }
};

export const uploadFileToServer = async ({
  blob,
  endDate,
  prefix,
  selectedFolder,
  onProgress,
}: {
  blob: Blob;
  endDate: number;
  prefix: string;
  selectedFolder: string;
  onProgress: (status: string) => void;
}) => {
  const videoFile = new File([blob], "video.webm", { type: blob.type });

  const url = new URL(UPLOAD_VIDEO, window.location.origin);

  url.search = new URLSearchParams({
    folder: selectedFolder,
    prefix,
    endDateAsString: endDate.toString(),
  }).toString();

  const streamer = makeStreamer((status, messageTypeId, data) => {
    const messageType = messageTypeIdToMessageType(
      messageTypeId as MessageTypeId,
    );
    const innerPayload =
      formatMap[messageType] === "json"
        ? parseJsonOrThrowSource(data, messageType)
        : data;

    const message: StreamingMessage = {
      successType: status,
      message: {
        type: messageType,
        payload: innerPayload,
      },
    };

    if (message.message.type === "converting-progress") {
      onProgress(`Converted ${message.message.payload.framesConverted} frames`);
    }
  });

  const res = await fetch(url, {
    method: "POST",
    body: videoFile,
  });
  if (!res.body) {
    throw new Error("No body");
  }

  const reader = res.body.getReader();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value, done } = await reader.read();
    if (value) {
      streamer.onData(value);
    }
    if (done) break;
  }
};
