"use client";

import { useRef, useState } from "react";

interface Recognizer {
  listen: (callback: (result: Result) => void, options: ListenOptions) => void;
  stopListening: () => void;
  ensureModelLoaded: () => Promise<void>;
  wordLabels: () => string[];
}

interface Result {
  scores: number[];
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

const AUDIO_MODEL_URL = "https://teachablemachine.withgoogle.com/models/dPCPVXqM8/";

interface TeachableMachineAudioProps {
  onVoiceStop: () => void;
}

const TeachableMachineAudio = ({ onVoiceStop }: TeachableMachineAudioProps) => {
  const labelContainerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const recognizerRef = useRef<Recognizer | null>(null);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  };

  const init = async () => {
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands@0.4.0/dist/speech-commands.min.js");

    const checkpointURL = AUDIO_MODEL_URL + "model.json";
    const metadataURL = AUDIO_MODEL_URL + "metadata.json";

    const recognizer = window.speechCommands.create("BROWSER_FFT", undefined, checkpointURL, metadataURL);
    await recognizer.ensureModelLoaded();
    recognizerRef.current = recognizer;

    const classLabels = recognizer.wordLabels();
    if (labelContainerRef.current) {
      labelContainerRef.current.innerHTML = "";
      for (let i = 0; i < classLabels.length; i++) {
        const div = document.createElement("div");
        labelContainerRef.current.appendChild(div);
      }
    }

    recognizer.listen(result => {
      const scores = result.scores;
      for (let i = 0; i < classLabels.length; i++) {
        const label = labelContainerRef.current?.childNodes[i] as HTMLDivElement;
        if (label) {
          label.innerText = `${classLabels[i]}: ${scores[i].toFixed(2)}`;
        }
      }

      const stopIndex = classLabels.findIndex(label => label.toLowerCase() === "stop");
      if (stopIndex !== -1 && scores[stopIndex] >= 0.75) {
        console.log("Voice Stop detected, triggering stop...");
        onVoiceStop();
      }
    }, {
      includeSpectrogram: true,
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.5,
    });
  };

  const handleStart = () => {
    setIsRunning(true);
    init();
  };

  const handleStop = () => {
    setIsRunning(false);
    recognizerRef.current?.stopListening();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!isRunning ? (
        <button onClick={handleStart} className="px-6 py-2 bg-[#4169e1] text-white rounded">
          Start Microphone
        </button>
      ) : (
        <button onClick={handleStop} className="px-6 py-2 bg-red-600 text-white rounded">
          Stop Microphone
        </button>
      )}
      <div ref={labelContainerRef} />
    </div>
  );
};

export default TeachableMachineAudio;
