"use client";

import { useEffect, useState } from "react";

interface FlashingCardProps {
  options: string[];
  correct: string;
  isFlashing: boolean;
  revealed: boolean;
  onOptionChange: (option: string) => void;
  lockedOption: string;
  flashSpeed: number;
}

const FlashingCard = ({
  options,
  correct,
  isFlashing,
  revealed,
  onOptionChange,
  lockedOption,
  flashSpeed,
}: FlashingCardProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isFlashing || revealed) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % options.length);
    }, flashSpeed); // Use flashSpeed directly here

    return () => clearInterval(interval);
  }, [isFlashing, revealed, options.length, flashSpeed]); //  flashSpeed is a dependency now

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
    <div className="text-4xl font-semibold w-60 h-40 sm:w-70 sm:h-50 md:w-80 md:h-60 lg:w-120 lg:h-80 border rounded-lg shadow-md bg-white text-[#4169e1] flex items-center justify-center">
      {display}
    </div>
  );
};

export default FlashingCard;
