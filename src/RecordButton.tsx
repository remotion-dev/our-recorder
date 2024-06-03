import React, { useCallback } from "react";
import { WEBCAM_PREFIX } from "../config/cameras";
import { FPS } from "../config/fps";
import { truthy } from "../remotion/helpers/truthy";
import { BlinkingCircle, RecordCircle } from "./BlinkingCircle";
import { Timer } from "./Timer";
import type { CurrentBlobs } from "./components/UseThisTake";
import { Button } from "./components/ui/button";
import { Prefix } from "./helpers/prefixes";
import { useKeyPress } from "./helpers/use-key-press";

export type MediaSources = {
  [key in Prefix]: MediaStream | null;
};

const mediaRecorderOptions: MediaRecorderOptions = {
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 8 * 4000000,
};

type FinishedRecording = {
  prefix: string;
  data: Blob;
  endDate: number;
};

type CurrentRecorder = {
  recorder: MediaRecorder;
  waitUntilDone: Promise<FinishedRecording>;
};

export type OngoingRecording = {
  startDate: number;
  recorders: CurrentRecorder[];
};

export const RecordButton: React.FC<{
  recording: OngoingRecording | null;
  setRecording: React.Dispatch<React.SetStateAction<OngoingRecording | null>>;
  recordingDisabled: boolean;
  setCurrentBlobs: React.Dispatch<React.SetStateAction<CurrentBlobs | null>>;
  mediaSources: MediaSources;
  showHandleVideos: boolean | number;
  setShowHandleVideos: React.Dispatch<React.SetStateAction<false | number>>;
}> = ({
  recording,
  showHandleVideos,
  recordingDisabled,
  mediaSources,
  setCurrentBlobs,
  setShowHandleVideos,
  setRecording,
}) => {
  const discardVideos = useCallback(() => {
    setCurrentBlobs(null);
  }, [setCurrentBlobs]);

  const start = useCallback(() => {
    const recorders = Object.entries(mediaSources)
      .map(([prefix, source]): CurrentRecorder | null => {
        if (!source) {
          return null;
        }

        const mimeType =
          prefix === WEBCAM_PREFIX
            ? "video/webm;codecs=vp8,opus"
            : "video/webm;codecs=vp8";

        const completeMediaRecorderOptions = {
          ...mediaRecorderOptions,
          mimeType,
        };

        const recorder = new MediaRecorder(
          source,
          completeMediaRecorderOptions,
        );

        const waitUntilDone = new Promise<FinishedRecording>(
          (resolve, reject) => {
            recorder.addEventListener("dataavailable", ({ data }) => {
              resolve({
                prefix,
                data,
                endDate: Date.now(),
              });
            });

            recorder.addEventListener("error", (event) => {
              console.log(event);
              reject(new Error(`Error recording ${prefix}`));
            });
          },
        );

        recorder.start();

        return { recorder, waitUntilDone };
      })
      .filter(truthy);

    return setRecording({ recorders: recorders, startDate: Date.now() });
  }, [mediaSources, setRecording]);

  const onStop = useCallback(() => {
    if (!recording) {
      return;
    }
    if (recording.recorders) {
      for (const recorder of recording.recorders) {
        recorder.recorder.stop();
      }
    }

    const endDate = Date.now();
    const expectedFrames = endDate - ((recording?.startDate || 0) / 1000) * FPS;
    setRecording(null);
    setShowHandleVideos(expectedFrames);
  }, [recording, setRecording, setShowHandleVideos]);

  const onPressR = useCallback(() => {
    if (mediaSources.webcam === null || !mediaSources.webcam.active) {
      return;
    }

    const dialog = document.querySelector('[role="dialog"]');

    if (
      (document.activeElement && document.activeElement.tagName === "input") ||
      dialog
    ) {
      return;
    }

    if (recording) {
      onStop();
    } else {
      start();
    }
  }, [mediaSources.webcam, onStop, recording, start]);

  const onDiscard = useCallback(() => {
    discardVideos();
    setShowHandleVideos(false);
    start();
  }, [discardVideos, setShowHandleVideos, start]);

  useKeyPress({ keys: ["r"], callback: onPressR, metaKey: false });

  if (recording) {
    return (
      <>
        <Button
          variant="outline"
          type="button"
          disabled={!recording}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
          title="Press R to stop recording"
          onClick={onStop}
        >
          Stop recording
        </Button>
        <BlinkingCircle />
        <Timer recording={recording} />
      </>
    );
  }

  if (showHandleVideos) {
    return (
      <Button
        variant="outline"
        type="button"
        style={{ display: "flex", alignItems: "center", gap: 10 }}
        title="Press R to start recording"
        onClick={onDiscard}
      >
        <RecordCircle recordingDisabled={recordingDisabled} />
        Discard and retake
      </Button>
    );
  }

  const startDisabled =
    recordingDisabled || recording !== null || showHandleVideos;

  return (
    <div
      title={
        startDisabled
          ? "A webcam and an audio source have to be selected to start the recording"
          : undefined
      }
    >
      <Button
        variant="outline"
        type="button"
        disabled={Boolean(startDisabled)}
        style={{ display: "flex", alignItems: "center", gap: 10 }}
        title="Press R to start recording"
        onClick={start}
      >
        <RecordCircle recordingDisabled={recordingDisabled} />
        Start recording
      </Button>
    </div>
  );
};
