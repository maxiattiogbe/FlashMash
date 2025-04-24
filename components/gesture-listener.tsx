"use client";

import { useEffect } from "react";

interface GestureListenerProps {
  onGestureMatch: () => void;
}

const MODEL_URL = "/my_model/"; // Adjust if needed

let model: any = null;
let webcam: any = null;
let rafId: number;

const GestureListener = ({ onGestureMatch }: GestureListenerProps) => {
  useEffect(() => {
    const loadScriptAndModel = async () => {
      // Load the Teachable Machine script dynamically
      await new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

      const tmImage = (window as any).tmImage;

      const modelURL = MODEL_URL + "model.json";
      const metadataURL = MODEL_URL + "metadata.json";

      model = await tmImage.load(modelURL, metadataURL);
      webcam = new tmImage.Webcam(200, 200, true); // width, height, flip
      await webcam.setup();
      await webcam.play();

      const loop = async () => {
        webcam.update();
        const prediction = await model.predict(webcam.canvas);
        const openHand = prediction.find((p: any) => p.className === "Open Hand");
        if (openHand?.probability > 0.9) {
          onGestureMatch();
        }
        rafId = requestAnimationFrame(loop);
      };

      loop();
    };

    loadScriptAndModel();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (webcam) webcam.stop();
    };
  }, [onGestureMatch]);

  return null;
};

export default GestureListener;
