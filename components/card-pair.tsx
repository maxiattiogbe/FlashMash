"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import FixedCard from "./fixed-card";
import FlashingCard from "./flashing-card";
import { Button } from "@/components/ui/button";
import TeachableMachineWebcam from "@/components/teachable-machine-webcam";
import TeachableMachineAudio from "./teachable-machine-audio";

type Source = "none" | "webcam" | "audio"; // which input is currently active?

const CardPair = ({ words }: { words: { Spanish: string; English: string }[] }) => {
  /** ---------- flash-card state ---------- */
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed]   = useState(false);
  const [isFlashing, setIsFlashing] = useState(true);

  const [currentOption, setCurrentOption] = useState("");
  const [lockedOption,  setLockedOption]  = useState("");

  const [correctCount, setCorrectCount] = useState(0);
  const [answers,      setAnswers]      = useState<{ word: string; answer: string; correct: boolean }[]>([]);
  const [flashSpeed,   setFlashSpeed]   = useState(5000);
  const [flashOptions, setFlashOptions] = useState<string[]>([]);

  const [wrongStreak,   setWrongStreak]   = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);

  const [feedbackMessage,setFeedbackMessage] = useState<string | null>(null);
  const [feedbackColor,  setFeedbackColor]  = useState<string>("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete,   setIsComplete]   = useState(false);

  const [startTime, setStartTime] = useState<number | null>(null);

  /** ---------- NEW: track which input (webcam / audio) is active ---------- */
  const [activeSource, setActiveSource] = useState<Source>("none");

  /** ---------- refs to avoid stale closures ---------- */
  const currentCard      = words[cardIndex];
  const currentCardRef   = useRef(currentCard);
  const currentOptionRef = useRef(currentOption);
  const cardIndexRef     = useRef(cardIndex);
  const isCompleteRef    = useRef(isComplete);

  useEffect(() => { currentCardRef.current   = currentCard;   }, [currentCard]);
  useEffect(() => { currentOptionRef.current = currentOption; }, [currentOption]);
  useEffect(() => { cardIndexRef.current     = cardIndex;     }, [cardIndex]);
  useEffect(() => { isCompleteRef.current    = isComplete;    }, [isComplete]);

  /** ---------- start-time: once per session ---------- */
  useEffect(() => {
    if (!startTime) setStartTime(Date.now());
  }, [startTime]);

  /** ---------- build the 4 English options for this card ---------- */
  useEffect(() => {
    if (!currentCard) return;

    const distractors = words
      .map((w) => w.English)
      .filter((eng) => eng !== currentCard.English);

    const selected = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
    setFlashOptions([...selected, currentCard.English].sort(() => 0.5 - Math.random()));
  }, [cardIndex, words, currentCard]);

  /** ---------- helpers ---------- */
  const next = useCallback(() => {
    if (cardIndexRef.current === words.length - 1) {
      setIsComplete(true);
      setIsFlashing(false);
      return;
    }
    setCardIndex((prev) => prev + 1);
    setRevealed(false);
    setIsFlashing(true);
    setLockedOption("");
    setFeedbackMessage(null);
    setFeedbackColor("");
    setIsProcessing(false);
    setCurrentOption("");
  }, [words.length]);

  const stop = useCallback(() => {
    if (isProcessing || !isFlashing || isCompleteRef.current) return;

    const card   = currentCardRef.current;
    const option = currentOptionRef.current;
    const isLast = cardIndexRef.current === words.length - 1;

    setIsProcessing(true);
    setIsFlashing(false);
    setRevealed(false);
    setLockedOption(option);

    const isCorrect = option === card.English;

    if (isCorrect) {
      setCorrectCount((p) => p + 1);
      setCorrectStreak((p) => p + 1);
      setWrongStreak(0);
      setFeedbackMessage("Correct!");
      setFeedbackColor("text-green-500");

      if ((correctStreak + 1) % 3 === 0) {
        setFlashSpeed((prev) => Math.max(2000, prev * 2 / 3));
      }

      setTimeout(isLast ? () => setIsComplete(true) : next, 1000);
    } else {
      setWrongStreak((p) => p + 1);
      setCorrectStreak(0);
      setFeedbackMessage(`Incorrect – you answered "${option}" but the right answer is "${card.English}"`);
      setFeedbackColor("text-red-500");

      if ((wrongStreak + 1) % 2 === 0) {
        setFlashSpeed((prev) => Math.min(10000, prev * 1.5));
      }

      setTimeout(isLast ? () => setIsComplete(true) : next, 5000);
    }

    setAnswers((prev) => [...prev, { word: card.Spanish, answer: card.English, correct: isCorrect }]);
  }, [next, isProcessing, isFlashing, correctStreak, wrongStreak, words.length]);

  /** ---------- callbacks for TM components ---------- */
  const handleWebcamStart = () => setActiveSource("webcam");
  const handleWebcamStop  = () => setActiveSource("none");
  const handleAudioStart  = () => setActiveSource("audio");
  const handleAudioStop   = () => setActiveSource("none");

  /** ---------- UI ---------- */
  if (isComplete) {
    const feedback = (() => {
      if (!startTime) return null;

      const pct = (correctCount / words.length) * 100;
      const secs = Math.floor((Date.now() - startTime) / 1000);
      const mm = Math.floor(secs / 60);
      const ss = secs % 60;

      return (
        <>
          <div className="text-left">
            {pct === 100
              ? `Perfect!`
              : pct >= 80
              ? `Nice work!`
              : `Better luck next time!`}{" "}
            Score: {correctCount}/{words.length} ({pct.toFixed(1)}%) – Total time:
            {" "}{mm}m {ss}s
          </div>
          <div className="whitespace-pre-line mt-4 text-left">
            {answers
              .map((a, i) =>
                a.correct
                  ? `${i + 1}. ${a.word} - ${a.answer} ✅`
                  : `${i + 1}. ${a.word} - ${a.answer}, but you chose "${currentOption}" ❌`
              )
              .join("\n")}
          </div>
        </>
      );
    })();

    return (
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">{feedback}</h2>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      {/* ------------------- multimodal controls ------------------- */}
      <div className="flex justify-center space-x-4">
        <TeachableMachineWebcam
          onOpenHand={stop}
          isFlashing={isFlashing}
          disabled={activeSource === "audio"}
          onStart={handleWebcamStart}
          onStop={handleWebcamStop}
        />
        <TeachableMachineAudio
          onVoiceStop={stop}
          isFlashing={isFlashing}
          disabled={activeSource === "webcam"}
          onStart={handleAudioStart}
          onStop={handleAudioStop}
        />
      </div>

      {/* ------------------- flash-cards ------------------- */}
      <div className="text-lg font-semibold mb-4">
        Card {cardIndex + 1}/{words.length}
      </div>

      <div className="flex justify-center items-center space-x-10">
        <FixedCard word={currentCard.Spanish} />
        <FlashingCard
          options={flashOptions}
          correct={currentCard.English}
          isFlashing={isFlashing}
          revealed={revealed}
          onOptionChange={setCurrentOption}
          lockedOption={lockedOption}
          flashSpeed={flashSpeed}
        />
      </div>

      <div className={`text-lg font-semibold mb-4 ${feedbackColor}`}>
        {feedbackMessage}
      </div>

      <div className="flex justify-center gap-3">
        <Button
          onClick={stop}
          size="lg"
          disabled={!isFlashing || isProcessing}
          className="text-lg p-4"
        >
          Stop
        </Button>
      </div>
    </div>
  );
};

export default CardPair;
