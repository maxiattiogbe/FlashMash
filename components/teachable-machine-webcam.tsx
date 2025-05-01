"use client";

import { useRef, useState, useEffect } from "react";

/* ----------------- Teachable-Machine Image types ---------------- */
interface Prediction {
  className: string;
  probability: number;
}
interface Model {
  predict: (canvas: HTMLCanvasElement) => Promise<Prediction[]>;
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
      load: (m: string, meta: string) => Promise<Model>;
      Webcam: new (w: number, h: number, flip: boolean) => Webcam;
    };
  }
}
/* ---------------------------------------------------------------- */

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/VyoPNGSIc/";

interface Props {
  onOpenHand: () => void;
  isFlashing: boolean;
  disabled: boolean;         // <-- NEW
  onStart: () => void;       // <-- NEW
  onStop: () => void;        // <-- NEW
}

const TeachableMachineWebcam = ({
  onOpenHand,
  isFlashing,
  disabled,
  onStart,
  onStop,
}: Props) => {
  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const webcamRef   = useRef<Webcam | null>(null);
  const modelRef    = useRef<Model  | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const hasTriggeredRef = useRef(false);

  const loadScript = (src: string) =>
    new Promise<void>((res, rej) => {
      const s = document.createElement("script");
      s.src = src; s.async = true; s.onload = () => res(); s.onerror = rej;
      document.body.appendChild(s);
    });

  const init = async () => {
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js");

    const modelURL = MODEL_URL + "model.json";
    const metaURL  = MODEL_URL + "metadata.json";

    modelRef.current  = await window.tmImage.load(modelURL, metaURL);
    webcamRef.current = new window.tmImage.Webcam(200, 200, true);

    await webcamRef.current.setup();
    await webcamRef.current.play();

    webcamContainerRef.current!.innerHTML = "";
    webcamContainerRef.current!.appendChild(webcamRef.current.canvas);

    requestAnimationFrame(loop);
  };

  const loop = async () => {
    if (!webcamRef.current || !modelRef.current) return;
    webcamRef.current.update();
    await predict();
    requestAnimationFrame(loop);
  };

  const predict = async () => {
    if (!modelRef.current || !webcamRef.current) return;
    const preds = await modelRef.current.predict(webcamRef.current.canvas);

    const open = preds.find(p => p.className.toLowerCase().includes("open") && p.probability >= 0.9);
    if (open && isFlashing && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      onOpenHand();
    }
  };

  /* ---------- controls ---------- */
  const handleStart = () => {
    setIsRunning(true);
    hasTriggeredRef.current = false;
    onStart();          // inform parent
    init();
  };
  const handleStop = () => {
    setIsRunning(false);
    onStop();           // inform parent
    webcamRef.current?.stop();
  };

  /* reset trigger whenever flashing restarts */
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
          Start&nbsp;Webcam
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="px-6 py-2 bg-red-600 text-white rounded"
        >
          Disable&nbsp;Webcam
        </button>
      )}

      <div ref={webcamContainerRef} />
    </div>
  );
};

export default TeachableMachineWebcam;
