"use client";

interface FixedCardProps {
  word: string;
}

const FixedCard = ({ word }: FixedCardProps) => {
  return (
    <div className="text-4xl font-semibold w-60 h-40 sm:w-70 sm:h-50 md:w-80 md:h-60 lg:w-120 lg:h-80 border rounded-lg shadow-md bg-white text-[#4169e1] flex items-center justify-center">
      {word}
    </div>
  );
};

export default FixedCard;
