"use client";

import { useRef, useState, useEffect } from "react";

/* ------------ Teachable-Machine Speech-Commands types ------------ */
interface Recognizer {
  listen: (cb: (r: Result) => void, o: ListenOptions) => void;
  stopListening: () => void;
  ensureModelLoaded: () => Promise<void>;
  wordLabels: () => string[];
}
interface Result          { scores: number[] }
interface ListenOptions   {
  includeSpectrogram: boolean;
  probabilityThreshold: number;
  invokeCallbackOnNoiseAndUnknown: boolean;
  overlapFactor: number;
}
declare global {
  interface Window {
    speechCommands: { create: (t: string, v: undefined, m: string, meta: string) => Recognizer };
  }
}
/* ----------------------------------------------------------------- */

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/dPCPVXqM8/";

interface Props {
  onVoiceStop: () => void;
  isFlashing: boolean;
  disabled: boolean;   // <-- NEW
  onStart: () => void; // <-- NEW
  onStop: () => void;  // <-- NEW
}

const TeachableMachineAudio = ({
  onVoiceStop,
  isFlashing,
  disabled,
  onStart,
  onStop,
}: Props) => {
  const labelContainerRef = useRef<HTMLDivElement>(null);

  const [isRunning, setIsRunning] = useState(false);
  const recognizerRef   = useRef<Recognizer | null>(null);
  const hasTriggeredRef = useRef(false);

  const loadScript = (src: string) =>
    new Promise<void>((res, rej) => {
      const s = document.createElement("script");
      s.src = src; s.async = true; s.onload = () => res(); s.onerror = rej;
      document.body.appendChild(s);
    });

  const init = async () => {
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands@0.4.0/dist/speech-commands.min.js");

    const modelURL = MODEL_URL + "model.json";
    const metaURL  = MODEL_URL + "metadata.json";

    const recognizer = window.speechCommands.create("BROWSER_FFT", undefined, modelURL, metaURL);
    await recognizer.ensureModelLoaded();
    recognizerRef.current = recognizer;

    /* build bars */
    const labels = recognizer.wordLabels();
    if (labelContainerRef.current) {
      labelContainerRef.current.innerHTML = "";
      labels.forEach((lbl) => {
        const row = document.createElement("div");
        row.className = "w-48 text-sm mb-1";
        const span = document.createElement("span");
        span.innerText = lbl;
        const track = document.createElement("div");
        track.className = "w-full h-2 bg-gray-200 rounded mt-1";
        const fill = document.createElement("div");
        fill.className = "h-full bg-[#4169e1] rounded";
        fill.style.width = "0%";
        track.appendChild(fill);
        row.appendChild(span);
        row.appendChild(track);
        labelContainerRef.current!.appendChild(row);
      });
    }

    recognizer.listen(
      (res) => {
        const scores = res.scores;
        const rows = labelContainerRef.current!.children;
        scores.forEach((p, idx) => {
          const fill = (rows[idx].children[1].children[0] as HTMLDivElement);
          fill.style.width = `${(p * 100).toFixed(0)}%`;
        });

        const stopIdx = recognizer.wordLabels().findIndex((l) => l.toLowerCase() === "stop");
        if (stopIdx !== -1 && scores[stopIdx] >= 0.9 && isFlashing && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          onVoiceStop();
        }
      },
      { includeSpectrogram: true, probabilityThreshold: 0.75, invokeCallbackOnNoiseAndUnknown: true, overlapFactor: 0.5 }
    );
  };

  /* controls */
  const handleStart = () => {
    setIsRunning(true);
    hasTriggeredRef.current = false;
    onStart();
    init();
  };
  const handleStop = () => {
    setIsRunning(false);
    onStop();
    recognizerRef.current?.stopListening();
  };

  /* reset trigger whenever flashing resumes */
  useEffect(() => {
    if (isFlashing) hasTriggeredRef.current = false;
  }, [isFlashing]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {!isRunning ? (
        <button
          onClick={handleStart}
          disabled={disabled}
          className={`px-6 py-2 rounded ${disabled ? "bg-gray-400 cursor-not-allowed text-white" : "bg-[#4169e1] text-white"}`}
        >
          Start&nbsp;Microphone
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="px-6 py-2 bg-red-600 text-white rounded"
        >
          Stop&nbsp;Microphone
        </button>
      )}

      <div ref={labelContainerRef} />
    </div>
  );
};

export default TeachableMachineAudio;
