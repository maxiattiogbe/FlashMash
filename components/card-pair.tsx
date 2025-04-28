"use client";

import {
  useEffect,
  useState,
  useRef,        
  useCallback    
} from "react";

import FixedCard                 from "./fixed-card";
import FlashingCard              from "./flashing-card";
import { Button }                from "@/components/ui/button";
import TeachableMachineWebcam    from "@/components/teachable-machine-webcam";
import TeachableMachineAudio     from "./teachable-machine-audio";

const CardPair = ({ words }: { words: { Spanish: string; English: string }[] }) => {
  const [cardIndex,      setCardIndex]      = useState(0);
  const [revealed,       setRevealed]       = useState(false);
  const [isFlashing,     setIsFlashing]     = useState(true);
  const [currentOption,  setCurrentOption]  = useState("");
  const [lockedOption,   setLockedOption]   = useState("");
  const [correctCount,   setCorrectCount]   = useState(0);
  const [startTime,      setStartTime]      = useState<number | null>(null);
  const [isComplete,     setIsComplete]     = useState(false);
  const [answers,        setAnswers]        = useState<{ word: string; answer: string; correct: boolean }[]>([]);
  const [flashSpeed,     setFlashSpeed]     = useState(5000);
  const [flashOptions,   setFlashOptions]   = useState<string[]>([]);
  const [wrongStreak,    setWrongStreak]    = useState(0);
  const [correctStreak,  setCorrectStreak]  = useState(0);
  const [feedbackMessage,setFeedbackMessage]= useState<string | null>(null);
  const [feedbackColor,  setFeedbackColor]  = useState<string>("");
  const [isProcessing,   setIsProcessing]   = useState(false);

  /* refs to always have latest values (fixes stale data) */
  const currentCard      = words[cardIndex];
  const currentCardRef   = useRef(currentCard);          
  const currentOptionRef = useRef(currentOption);         
  const isCompleteRef    = useRef(isComplete);
  const cardIndexRef     = useRef(cardIndex);

  /* keep refs up-to-date */
  useEffect(() => { currentCardRef.current   = currentCard;   }, [currentCard]);      
  useEffect(() => { currentOptionRef.current = currentOption; }, [currentOption]);    
  useEffect(() => { isCompleteRef.current    = isComplete;    }, [isComplete]);
  useEffect(() => { cardIndexRef.current     = cardIndex;     }, [cardIndex]);

  // Set start time after mount to avoid hydration mismatch
  useEffect(() => {
    if (!startTime) {
      const initialTime = Date.now();
      setStartTime(initialTime);
      // console.log('Start time set to:', initialTime);
    }
  }, [startTime]);

  // Generate options on client side only
  useEffect(() => {
    if (!currentCard) return;

    const distractors = words
      .map(w => w.English)
      .filter(eng => eng !== currentCard.English);

    // Pick 3 random distractors
    const selectedDistractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Combine with correct answer and shuffle
    setFlashOptions([...selectedDistractors, currentCard.English].sort(() => 0.5 - Math.random()));
  }, [cardIndex, words, currentCard]);

  const getFeedback = () => {
    if (!startTime || !currentCard) return null;

    const percentage   = (correctCount / words.length) * 100;
    const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes      = Math.floor(totalSeconds / 60);
    const seconds      = totalSeconds % 60;
    const timeText     = `Total time: ${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
    const scoreText    = `Score: ${correctCount}/${words.length} (${percentage.toFixed(1)}%)`;

    const resultsList  = answers.map((answer, index) => {
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

  const next = useCallback(() => {
    if (cardIndexRef.current === words.length - 1) {
      setIsComplete(true);
      setIsFlashing(false);
      return;
    }
    setCardIndex(prev => prev + 1);
    setRevealed(false);
    setIsFlashing(true);
    setLockedOption("");
    setFeedbackMessage(null);
    setFeedbackColor("");
    setIsProcessing(false);
    setCurrentOption(""); // Reset current option when moving to next card
  }, [words.length]);

  /* stop() now uses refs so it always evaluates the CURRENT card/option */
  const stop = useCallback(() => {        
    if (isProcessing || !isFlashing || isCompleteRef.current) return;

    const card   = currentCardRef.current;     
    const option = currentOptionRef.current;   
    const isLastCard = cardIndexRef.current === words.length - 1;

    setIsProcessing(true);
    setIsFlashing(false);
    setRevealed(false);
    setLockedOption(option);

    const isCorrect = option === card.English;

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setCorrectStreak(prev => prev + 1);
      setWrongStreak(0);
      setFeedbackMessage("Correct!");
      setFeedbackColor("text-green-500");

      if ((correctStreak + 1) % 3 === 0) {       
        setFlashSpeed(prev => Math.max(2000, prev * 2 / 3));
      }

      if (isLastCard) {
        setTimeout(() => {
          setIsComplete(true);
        }, 1000);
      } else {
        setTimeout(next, 1000);
      }
    } else {
      setWrongStreak(prev => prev + 1);
      setCorrectStreak(0);
      setFeedbackMessage(`Incorrect - you answered "${option}" but the right answer is "${card.English}"`);
      setFeedbackColor("text-red-500");

      if ((wrongStreak + 1) % 2 === 0) {         
        setFlashSpeed(prev => Math.min(10000, prev * 1.5));
      }

      if (isLastCard) {
        setTimeout(() => {
          setIsComplete(true);
        }, 5000);
      } else {
        setTimeout(next, 5000);
      }
    }

    setAnswers(prev => [
      ...prev,
      { word: card.Spanish, answer: card.English, correct: isCorrect }
    ]);
  }, [next, isProcessing, isFlashing, correctStreak, wrongStreak, words.length]);  

  // When TM components invoke stop they still pass the SAME function (identity stable)

  if (isComplete) {
    const feedback = getFeedback();
    if (!feedback) return null;
    return (
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">{feedback}</h2>
      </div>
    );
  }

  // if (!words.length || !currentCard) {
  //   return <div className="text-center">No flashcards available</div>;
  // }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center space-x-4">
        <TeachableMachineWebcam onOpenHand={stop} isFlashing={isFlashing} />
        <TeachableMachineAudio  onVoiceStop={stop} isFlashing={isFlashing} />
      </div>

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
