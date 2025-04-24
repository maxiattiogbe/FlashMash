"use client";

import { useEffect, useState } from "react";
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
  const [answers, setAnswers] = useState<{ word: string, answer: string, correct: boolean }[]>([]);
  const [flashSpeed, setFlashSpeed] = useState(1000); // initial speed in ms
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [flashOptions, setFlashOptions] = useState<string[]>([]);

  const currentCard = words[cardIndex];

  // ✅ Generate options on client side only
  useEffect(() => {
    const distractors = words
      .map(w => w.English)
      .filter(eng => eng !== currentCard.English);
  
    // Pick 3 random distractors
    const selectedDistractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
  
    // Combine with correct answer
    const combined = [...selectedDistractors, currentCard.English];
  
    // Shuffle the final 4
    const shuffledOptions = combined.sort(() => 0.5 - Math.random());
  
    setFlashOptions(shuffledOptions);
  }, [cardIndex, words, currentCard.English]);
  
  // ✅ Log speed for debugging
  useEffect(() => {
    console.log("Current Flash Speed:", flashSpeed);
  }, [flashSpeed]);

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
      return answer.correct
        ? `${index + 1}. ${answer.word} - ${answer.answer} ✅`
        : `${index + 1}. ${answer.word} - ${answer.answer}, but you chose "${currentOption}" ❌`;
    }).join('\n');

    return (
      <>
        <div className="text-left">
          {percentage === 100
            ? `Perfect! ${scoreText}. ${timeText}`
            : percentage >= 80
              ? `Nice work! ${scoreText}. ${timeText}`
              : `Better luck next time! ${scoreText}. ${timeText}`}
        </div>
        <div className="whitespace-pre-line mt-4 text-left">{resultsList}</div>
      </>
    );
  };

  const next = () => {
    if (cardIndex === words.length - 1) {
      setIsComplete(true);
      return;
    }
    setCardIndex(prev => prev + 1);
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

    setAnswers(prev => [
      ...prev,
      {
        word: currentCard.Spanish,
        answer: currentCard.English,
        correct: isCorrect,
      },
    ]);

    if (isCorrect) {
      setCorrectStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak % 3 === 0) {
          setFlashSpeed(prevSpeed => Math.max(500, prevSpeed * Math.sqrt(0.82)));
          return 0;
        }
        return newStreak;
      });
      setWrongStreak(0);
    } else {
      setWrongStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak % 2 === 0) {
          setFlashSpeed(prevSpeed => Math.min(5000, prevSpeed * Math.sqrt(1.5)));
          return 0;
        }
        return newStreak;
      });
      setCorrectStreak(0);
    }
  };

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
          flashSpeed={flashSpeed}
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
