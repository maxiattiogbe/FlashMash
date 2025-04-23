"use client";

import { useState} from "react";
import FixedCard from "./fixed-card";
import FlashingCard from "./flashing-card";
import { Button } from "@/components/ui/button";

const CardPair = ({ words }: { words: { Spanish: string; English: string }[] }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isFlashing, setIsFlashing] = useState(true);
  const [currentOption, setCurrentOption] = useState("");
  const [lockedOption, setLockedOption] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<{word: string, answer: string, correct: boolean}[]>([]);

  const currentCard = words[cardIndex];

  const reveal = () => {
    setRevealed(true);
    setIsFlashing(false);
  };

  const getFeedback = () => {
    const percentage = (correctCount / words.length) * 100;
    const totalSeconds = (Date.now() - startTime) / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const timeText = `Total time: ${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
    const scoreText = `Score: ${correctCount}/${words.length} (${percentage.toFixed(1)}%)`;

    const resultsList = answers.map((answer, index) => {
      if (answer.correct) {
        return `${index + 1}. ${answer.word} - ${answer.answer} ✅`;
      } else {
        return `${index + 1}. ${answer.word} - ${answer.answer}, but you chose "${currentOption}" ❌`;
      }
    }).join('\n');

    if (percentage === 100) {
      return (
        <>
          <div className="text-left">Perfect! {scoreText} {timeText}</div>
          <div className="whitespace-pre-line mt-4 text-left">{resultsList}</div>
        </>
      );
    } else if (percentage >= 80) {
      return (
        <>
          <div className="text-left">Nice work! {scoreText}. {timeText}</div>
          <div className="whitespace-pre-line mt-4 text-left">{resultsList}</div>
        </>
      );
    } else {
      return (
        <>
          <div className="text-left">Better luck next time! {scoreText}. {timeText}</div>
          <div className="whitespace-pre-line mt-4 text-left">{resultsList}</div>
        </>
      );
    }
  };

  const next = () => {
    if (cardIndex === words.length - 1) {
      setIsComplete(true);
      return;
    }
    setCardIndex((prev) => prev + 1);
    setRevealed(false);
    setIsFlashing(true);
    setLockedOption("");
  };

  const stop = () => {
    setIsFlashing(false);
    setRevealed(false);
    setLockedOption(currentOption);
  
    const isCorrect = currentOption === currentCard.English;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      alert("Correct!");
    } else {
      alert(`Incorrect - you answered "${currentOption}" but the right answer is "${currentCard.English}"`);
    }

    setAnswers(prev => [...prev, {
      word: currentCard.Spanish,
      answer: currentCard.English,
      correct: isCorrect
    }]);
  };

  const distractors = words
    .map((w) => w.English)
    .filter((eng) => eng !== currentCard.English);

  const flashOptions = [currentCard.English, ...distractors].sort(() => 0.5 - Math.random()).slice(0, 4);

  if (isComplete) {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">{getFeedback()}</h2>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
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
        />
      </div>
      <div className="flex justify-center gap-3">
        <Button onClick={stop} disabled={!isFlashing}>Stop</Button>
        <Button onClick={reveal} disabled={revealed}>Reveal</Button>
        <Button onClick={next}>{cardIndex === words.length - 1 ? 'See Results' : 'Next'}</Button>
      </div>
    </div>
  );
};

export default CardPair;
