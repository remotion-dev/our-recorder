import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { parseSrt } from "./parse-srt";

const Text: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        fontSize: 50,
        paddingBottom: 50,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          backgroundColor: "red",
          padding: 15,
          color: "white",
          fontFamily: "Helvetica, Arial, sans-serif",
          pointerEvents: "unset",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const SimulatedSrt: React.FC<{
  srt: string;
}> = ({ srt }) => {
  const { fps } = useVideoConfig();
  const parsed = useMemo(() => {
    return parseSrt(srt);
  }, [srt]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {parsed.map((segment) => {
        // TODO: Should by default have a minimum duration

        const durationInFrames = Math.max(
          1,
          (segment.endInSeconds - segment.startInSeconds) * fps,
        );
        const from = segment.startInSeconds * fps;
        console.log(from, durationInFrames, segment);

        return (
          <Sequence
            key={segment.index}
            durationInFrames={durationInFrames}
            from={from}
            style={{
              pointerEvents: "none",
            }}
          >
            <Text text={segment.text} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
