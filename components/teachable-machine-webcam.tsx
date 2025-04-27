"use client";

import { useRef, useState } from "react";

interface Prediction {
  className: string;
  probability: number;
}

interface Model {
  predict: (input: HTMLCanvasElement) => Promise<Prediction[]>;
  getTotalClasses: () => number;
}

interface Webcam {
  canvas: HTMLCanvasElement;
  setup: () => Promise<void>;
  play: () => Promise<void>;
  stop: () => void;
  update: () => void;
}

declare global {
  interface Window {
    tmImage: {
      load: (modelURL: string, metadataURL: string) => Promise<Model>;
      Webcam: new (width: number, height: number, flip: boolean) => Webcam;
    };
  }
}

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/VyoPNGSIc/";

interface TeachableMachineWebcamProps {
  onOpenHand: () => void;
}

const TeachableMachineWebcam = ({ onOpenHand }: TeachableMachineWebcamProps) => {
  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const labelContainerRef = useRef<HTMLDivElement>(null);

  const webcamRef = useRef<Webcam | null>(null);
  const modelRef = useRef<Model | null>(null);
  const [isRunning, setIsRunning] = useState(false);

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
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js");

    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    const model = await window.tmImage.load(modelURL, metadataURL);
    modelRef.current = model;

    const webcam = new window.tmImage.Webcam(200, 200, true);
    await webcam.setup();
    await webcam.play();
    webcamRef.current = webcam;

    if (webcamContainerRef.current) {
      webcamContainerRef.current.innerHTML = "";
      webcamContainerRef.current.appendChild(webcam.canvas);
    }

    if (labelContainerRef.current) {
      labelContainerRef.current.innerHTML = "";
      for (let i = 0; i < model.getTotalClasses(); i++) {
        const div = document.createElement("div");
        labelContainerRef.current.appendChild(div);
      }
    }

    requestAnimationFrame(loop);
  };

  const loop = async () => {
    if (!webcamRef.current || !modelRef.current) return;
    webcamRef.current.update();
    await predict();
    requestAnimationFrame(loop);
  };

  const predict = async () => {
    if (!webcamRef.current || !modelRef.current || !labelContainerRef.current) return;

    const predictions = await modelRef.current.predict(webcamRef.current.canvas);
    predictions.forEach((pred, i) => {
      const label = labelContainerRef.current?.childNodes[i] as HTMLDivElement;
      if (label) {
        label.innerText = `${pred.className}: ${pred.probability.toFixed(2)}`;
      }
    });

    // Check if open hand probability is high enough
    const openHand = predictions.find(p => p.className.toLowerCase().includes("open") && p.probability >= 0.9);
    if (openHand) {
      console.log("Open hand detected, triggering stop...");
      onOpenHand(); // 🚀 Trigger stop function from parent!
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    init();
  };

  const handleStop = () => {
    setIsRunning(false);
    webcamRef.current?.stop();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!isRunning ? (
        <button onClick={handleStart} className="px-6 py-2 bg-[#4169e1] text-white rounded">
          Enable Webcam
        </button>
      ) : (
        <button onClick={handleStop} className="px-6 py-2 bg-red-600 text-white rounded">
          Disable Webcam
        </button>
      )}
      <div ref={webcamContainerRef} />
      <div ref={labelContainerRef} />
    </div>
  );
};

export default TeachableMachineWebcam;
