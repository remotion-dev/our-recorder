import React, { useCallback, useState } from "react";
import { RecordingStatus } from "../RecordButton";
import { downloadVideo } from "../helpers/download-video";
import { uploadFileToServer } from "../helpers/upload-file";
import { ProcessStatus, ProcessingStatus } from "./ProcessingStatus";
import { Button } from "./ui/button";

export const UseThisTake: React.FC<{
  readonly selectedFolder: string | null;
  readonly uploading: boolean;
  readonly setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  recordingStatus: RecordingStatus;
  setRecordingStatus: React.Dispatch<React.SetStateAction<RecordingStatus>>;
}> = ({
  selectedFolder,
  uploading,
  setUploading,
  recordingStatus,
  setRecordingStatus,
}) => {
  const [status, setStatus] = useState<ProcessStatus | null>(null);

  const keepVideoOnServer = useCallback(async () => {
    if (recordingStatus.type !== "recording-finished") {
      return Promise.resolve();
    }

    if (selectedFolder === null) {
      // eslint-disable-next-line no-alert
      alert("Please select a folder first.");
      return Promise.resolve();
    }

    for (const blob of recordingStatus.blobs) {
      await uploadFileToServer({
        blob: blob.data,
        endDate: recordingStatus.endDate,
        prefix: blob.prefix,
        selectedFolder,
        onProgress: (stat) => {
          setStatus(stat);
        },
        expectedFrames: recordingStatus.expectedFrames,
      });
    }

    setRecordingStatus({ type: "idle" });
  }, [selectedFolder]);

  const keepVideoOnClient = useCallback(() => {
    if (recordingStatus.type !== "recording-finished") {
      return Promise.resolve();
    }

    for (const blob of recordingStatus.blobs) {
      downloadVideo(blob.data, recordingStatus.endDate, blob.prefix);
    }

    setRecordingStatus({ type: "idle" });
  }, []);

  const keepVideos = useCallback(async () => {
    if (window.remotionServerEnabled) {
      await keepVideoOnServer();
    } else {
      keepVideoOnClient();
    }
  }, [keepVideoOnClient, keepVideoOnServer]);

  const handleUseTake = useCallback(async () => {
    setUploading(true);
    try {
      await keepVideos();
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line no-alert
      alert((err as Error).stack);
    } finally {
      setUploading(false);
    }
  }, [keepVideos, setUploading]);

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
