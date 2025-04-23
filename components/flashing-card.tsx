"use client";

import { useEffect, useState } from "react";

interface FlashingCardProps {
  options: string[];
  correct: string;
  isFlashing: boolean;
  revealed: boolean;
  onOptionChange: (option: string) => void;
  lockedOption: string;
}

const FlashingCard = ({ options, correct, isFlashing, revealed, onOptionChange, lockedOption }: FlashingCardProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isFlashing || revealed) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % options.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFlashing, revealed, options.length]);

  useEffect(() => {
    if (isFlashing) {
      onOptionChange(options[index]);
    }
  }, [index, isFlashing, onOptionChange, options]);

  const display = revealed
  ? correct
  : isFlashing
    ? options[index]
    : lockedOption;

  return (
    <div className="text-2xl font-semibold w-48 h-32 sm:w-56 sm:h-36 md:w-64 md:h-40 lg:w-72 lg:h-48 border rounded-lg shadow-md bg-white text-black flex items-center justify-center">
      {display}
    </div>
  );
};

export default FlashingCard;
