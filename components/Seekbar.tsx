import React, { ChangeEvent } from "react";

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

const SeekBar: React.FC<SeekBarProps> = ({
  currentTime,
  duration,
  onSeek,
  className,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const percentage = parseFloat(event.target.value);
    const newTime = (percentage / 100) * duration;
    onSeek(newTime);
  };

  const normalizedValue = (currentTime / duration) * 100;

  return (
    <input
      type="range"
      min="0"
      max="100"
      value={normalizedValue.toString()}
      onChange={handleChange}
      className={`w-30% h-1 rounded bg-gray-300 opacity-70 transition-opacity 
                 duration-200 focus:outline-none hover:opacity-100 
                 appearance-none range-slider ${className}`}
      style={{
        background: `linear-gradient(to right, #4c1d95 0%, #4c1d95 ${
          normalizedValue + 0.5
        }%, #ddd ${normalizedValue + 0.5}%, #ddd 100%)`,
      }}
    />
  );
};

export default SeekBar;
