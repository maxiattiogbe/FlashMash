"use client";

import { useRef, useState, useEffect } from "react";

/* ---------- Teachable-Machine / Speech-Commands types ---------- */
interface Recognizer {
  listen: (cb: (result: Result) => void, opts: ListenOptions) => void;
  stopListening: () => void;
  ensureModelLoaded: () => Promise<void>;
  wordLabels: () => string[];
}

interface Result {
  scores: number[];          // probability per class
}

interface ListenOptions {
  includeSpectrogram: boolean;
  probabilityThreshold: number;
  invokeCallbackOnNoiseAndUnknown: boolean;
  overlapFactor: number;
}

declare global {
  interface Window {
    speechCommands: {
      create: (
        type: string,
        vocabFeature: undefined,
        modelURL: string,
        metadataURL: string
      ) => Recognizer;
    };
  }
}
/* ---------------------------------------------------------------- */

const AUDIO_MODEL_URL =
  "https://teachablemachine.withgoogle.com/models/dPCPVXqM8/";

interface TeachableMachineAudioProps {
  onVoiceStop: () => void;   // function to trigger your Stop logic
  isFlashing: boolean;       // whether the cards are flashing
}

const TeachableMachineAudio = ({
  onVoiceStop,
  isFlashing,
}: TeachableMachineAudioProps) => {
  const labelContainerRef = useRef<HTMLDivElement>(null);

  const [isRunning, setIsRunning] = useState(false);
  const recognizerRef = useRef<Recognizer | null>(null);
  const hasTriggeredRef = useRef(false);        // avoid double-trigger

  /* ---------- helper to append <script> on demand ---------- */
  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = reject;
      document.body.appendChild(s);
    });

  /* ---------- initialise model and start listening ---------- */
  const init = async () => {
    await loadScript(
      "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands@0.4.0/dist/speech-commands.min.js"
    );

    const checkpointURL = AUDIO_MODEL_URL + "model.json";
    const metadataURL = AUDIO_MODEL_URL + "metadata.json";

    const recognizer = window.speechCommands.create(
      "BROWSER_FFT",
      undefined,
      checkpointURL,
      metadataURL
    );
    await recognizer.ensureModelLoaded();
    recognizerRef.current = recognizer;

    /* ----- build one row (label + progress bar) per class ----- */
    const classLabels = recognizer.wordLabels();
    if (labelContainerRef.current) {
      labelContainerRef.current.innerHTML = "";          // clear first
      classLabels.forEach((label) => {
        const row = document.createElement("div");
        row.className = "w-48 text-sm mb-1";

        const textSpan = document.createElement("span");
        textSpan.innerText = label;

        const track = document.createElement("div");     // grey track
        track.className = "w-full h-2 bg-gray-200 rounded mt-1";

        const fill = document.createElement("div");      // blue fill
        fill.className = "h-full bg-blue-500 rounded";
        fill.style.width = "0%";

        track.appendChild(fill);
        row.appendChild(textSpan);
        row.appendChild(track);
        labelContainerRef.current!.appendChild(row);
      });
    }

    /* ----- start listening ----- */
    recognizer.listen(
      (result) => {
        const scores = result.scores;
        const container = labelContainerRef.current;
        if (!container) return;

        // Update every bar width
        scores.forEach((p, idx) => {
          const row = container.children[idx] as HTMLDivElement;
          const fill = row.children[1].children[0] as HTMLDivElement; // inner bar
          fill.style.width = `${(p * 100).toFixed(0)}%`;
        });

        // If “Stop” probability ≥ 0.9, trigger
        const stopIdx = recognizer.wordLabels().findIndex(
          (l) => l.toLowerCase() === "stop"
        );
        if (
          stopIdx !== -1 &&
          scores[stopIdx] >= 0.9 &&
          isFlashing &&
          !hasTriggeredRef.current
        ) {
          hasTriggeredRef.current = true;
          onVoiceStop();
        }
      },
      {
        includeSpectrogram: true,
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.5,
      }
    );
  };

  /* ---------- public controls ---------- */
  const handleStart = () => {
    setIsRunning(true);
    hasTriggeredRef.current = false;
    init();
  };

  const handleStop = () => {
    setIsRunning(false);
    recognizerRef.current?.stopListening();
  };

  /* reset trigger each time we resume flashing */
  useEffect(() => {
    if (isFlashing) hasTriggeredRef.current = false;
  }, [isFlashing]);

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col items-center space-y-4">
      {!isRunning ? (
        <button
          onClick={handleStart}
          className="px-6 py-2 bg-[#4169e1] text-white rounded"
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

      {/* probability bars */}
      <div ref={labelContainerRef} />
    </div>
  );
};

export default TeachableMachineAudio;
