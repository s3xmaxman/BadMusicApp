import { ChangeEvent } from 'react';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const SeekBar: React.FC<SeekBarProps> = ({ currentTime, duration, onSeek }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const percentage = parseFloat(event.target.value);
    const newTime = (percentage / 100) * duration;
    onSeek(newTime);
  };

  const normalizedValue = (currentTime / duration) * 100;

  return (
    <input
      type="range"
      min={0}
      max={100}
      value={normalizedValue}
      onChange={handleChange}
    />
  );
};

export default SeekBar;







  



