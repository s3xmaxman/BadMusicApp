// useYouTubePlayer.ts
import { useState } from "react";

const useYouTubePlayer = (videoId: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (newVolume < 0) newVolume = 0;
    if (newVolume > 100) newVolume = 100;
    setVolume(newVolume);
  };

  return {
    isPlaying,
    volume,
    togglePlay,
    handleVolumeChange,
  };
};

export default useYouTubePlayer;
