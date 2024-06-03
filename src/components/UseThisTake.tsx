import React, { useCallback, useState } from "react";
import { downloadVideo } from "../helpers/download-video";
import { Prefix } from "../helpers/prefixes";
import { uploadFileToServer } from "../helpers/upload-file";
import { ProcessStatus, ProcessingStatus } from "./ProcessingStatus";
import { Button } from "./ui/button";

export type CurrentBlobs = {
  endDate: number;
  blobs: { [key in Prefix]: Blob | null };
};

export const UseThisTake: React.FC<{
  readonly selectedFolder: string | null;
  readonly currentBlobs: CurrentBlobs | null;
  readonly setCurrentBlobs: React.Dispatch<
    React.SetStateAction<CurrentBlobs | null>
  >;
  readonly setShowHandleVideos: React.Dispatch<
    React.SetStateAction<false | number>
  >;
  readonly uploading: boolean;
  readonly setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  durationInFrames: number;
}> = ({
  currentBlobs,
  selectedFolder,
  setCurrentBlobs,
  setShowHandleVideos,
  uploading,
  setUploading,
  durationInFrames,
}) => {
  const [status, setStatus] = useState<ProcessStatus | null>(null);

  const keepVideoOnServer = useCallback(async () => {
    if (currentBlobs === null) {
      return Promise.resolve();
    }

    if (selectedFolder === null) {
      // eslint-disable-next-line no-alert
      alert("Please select a folder first.");
      return Promise.resolve();
    }

    for (const [prefix, blob] of Object.entries(currentBlobs.blobs)) {
      if (blob === null) {
        continue;
      }

      await uploadFileToServer({
        blob,
        endDate: currentBlobs.endDate,
        prefix,
        selectedFolder,
        onProgress: (stat) => {
          setStatus(stat);
        },
        expectedFrames: durationInFrames,
      });
    }

    setCurrentBlobs(null);
    return Promise.resolve();
  }, [currentBlobs, selectedFolder, setCurrentBlobs, durationInFrames]);

  const keepVideoOnClient = useCallback(() => {
    if (currentBlobs === null) {
      return Promise.resolve();
    }

    for (const [prefix, blob] of Object.entries(currentBlobs.blobs)) {
      if (blob !== null) {
        downloadVideo(blob, currentBlobs.endDate, prefix);
      }
    }

    setCurrentBlobs(null);
  }, [currentBlobs, setCurrentBlobs]);

  const keepVideos = useCallback(async () => {
    if (currentBlobs === null) {
      return Promise.resolve();
    }

    if (window.remotionServerEnabled) {
      await keepVideoOnServer();
    } else {
      keepVideoOnClient();
    }
  }, [currentBlobs, keepVideoOnClient, keepVideoOnServer]);

  const handleUseTake = useCallback(async () => {
    setUploading(true);
    try {
      await keepVideos();
      setShowHandleVideos(false);
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line no-alert
      alert((err as Error).stack);
    } finally {
      setUploading(false);
    }
  }, [keepVideos, setShowHandleVideos, setUploading]);

  return (
    <>
      <Button
        variant="default"
        type="button"
        title="Copy this take"
        disabled={uploading}
        onClick={handleUseTake}
      >
        {uploading
          ? "Copying..."
          : window.remotionServerEnabled
            ? `Copy to public/${selectedFolder}`
            : "Download this take"}
      </Button>
      {status && <ProcessingStatus status={status}></ProcessingStatus>}
    </>
  );
};
