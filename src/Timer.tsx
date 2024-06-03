import React, { useEffect, useState } from "react";
import { OngoingRecording } from "./RecordButton";
import { formatTime } from "./helpers/format-time";

export const Timer: React.FC<{
  recording: OngoingRecording;
}> = ({ recording }) => {
  const [, setTime] = useState(0);
  useEffect(() => {
    const int = setInterval(() => {
      setTime(Date.now() - recording.startDate);
    }, 1000);

    return () => {
      clearInterval(int);
    };
  }, [recording]);

  return <>{formatTime(Date.now() - recording.startDate)}</>;
};
