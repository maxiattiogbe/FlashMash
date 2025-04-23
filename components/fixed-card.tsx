"use client";

interface FixedCardProps {
  word: string;
}

const FixedCard = ({ word }: FixedCardProps) => {
  return (
    <div className="text-2xl font-semibold w-48 h-32 sm:w-56 sm:h-36 md:w-64 md:h-40 lg:w-72 lg:h-48 border rounded-lg shadow-md bg-white text-[#4169e1] flex items-center justify-center">
      {word}
    </div>
  );
};

export default FixedCard;
