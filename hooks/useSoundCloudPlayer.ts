import { useState, useRef, useCallback, useEffect } from "react";
import ReactPlayer from "react-player";

interface UseSoundCloudPlayerProps {
  url: string;
  onEnded: () => void;
}

export const useSoundCloudPlayer = ({
  url,
  onEnded,
}: UseSoundCloudPlayerProps) => {
  const [isLooping, setIsLooping] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [trackImage, setTrackImage] = useState("");
  const [volume, setVolume] = useState(0.1);

  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    fetch(
      `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.thumbnail_url) {
          setTrackImage(data.thumbnail_url);
        }
      })
      .catch((error) => console.error("Error fetching track info:", error));
  }, [url]);

  const togglePlay = (
    isPlaying: boolean,
    onPlay: () => void,
    onPause: () => void
  ) => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (seeking) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newPlayed = (e.clientX - rect.left) / rect.width;

      setPlayed(newPlayed);
      playerRef.current?.seekTo(newPlayed);
    }
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setSeeking(false);
    const rect = e.currentTarget.getBoundingClientRect();
    const newPlayed = (e.clientX - rect.left) / rect.width;

    setPlayed(newPlayed);
    playerRef.current?.seekTo(newPlayed);
  };

  const handleProgress = useCallback(
    ({ played, playedSeconds }: { played: number; playedSeconds: number }) => {
      if (!seeking) {
        setPlayed(played);
        setPlayedSeconds(playedSeconds);
      }

      if (isLooping && duration > 0 && playedSeconds >= duration - 1) {
        playerRef.current?.seekTo(0);
      }

      if (!isLooping && duration > 0 && playedSeconds >= duration) {
        onEnded();
      }
    },
    [seeking, isLooping, duration, onEnded]
  );

  const handleDuration = (newDuration: number) => {
    setDuration(newDuration);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const toggleMute = () => {
    setVolume((prev) => (prev === 0 ? 0.1 : 0));
  };

  return {
    isLooping,
    playedSeconds,
    duration,
    played,
    seeking,
    setSeeking,
    trackImage,
    volume,
    playerRef,
    togglePlay,
    handleSeekMouseDown,
    handleSeekChange,
    handleSeekMouseUp,
    handleProgress,
    handleDuration,
    handleVolumeChange,
    toggleMute,
    setIsLooping,
  };
};
