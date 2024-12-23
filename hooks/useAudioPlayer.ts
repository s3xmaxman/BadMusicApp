import { useEffect, useState, useRef, useMemo } from "react";
import usePlayer from "@/hooks/usePlayer";
import { isMobile } from "react-device-detect";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

const useAudioPlayer = (songUrl: string) => {
  const player = usePlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(isMobile ? 1 : 0.1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isRepeating = usePlayer((state) => state.isRepeating);
  const isShuffling = usePlayer((state) => state.isShuffling);
  const isSuno = songUrl.includes("suno") ? true : false;

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const onPlayNext = () => {
    if (isRepeating) {
      player.toggleRepeat();
    }
    const nextSongId = player.getNextSongId();
    if (nextSongId) {
      player.setId(nextSongId, isSuno);
    }
  };

  const onPlayPrevious = () => {
    if (isRepeating) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      const prevSongId = player.getPreviousSongId();
      if (prevSongId) {
        player.setId(prevSongId, isSuno);
      }
    }
  };

  const toggleRepeat = () => {
    player.toggleRepeat();
  };

  const toggleShuffle = () => {
    player.toggleShuffle();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        onPlayNext();
      }
    };
    const handleCanPlayThrough = () => audio.play();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [songUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !songUrl) return;

    audio.currentTime = 0;
    audio.src = songUrl;
  }, [songUrl]);

  const formatTime = useMemo(() => {
    return (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
  }, []);

  const formattedCurrentTime = useMemo(
    () => formatTime(currentTime),
    [currentTime]
  );

  const formattedDuration = useMemo(() => formatTime(duration), [duration]);

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(0.1);
    } else {
      setVolume(0);
    }
  };

  return {
    Icon,
    VolumeIcon,
    formattedCurrentTime,
    formattedDuration,
    toggleMute,
    volume,
    setVolume,
    audioRef,
    currentTime,
    duration,
    isPlaying,
    isRepeating,
    isShuffling,
    handlePlay,
    handleSeek,
    onPlayNext,
    onPlayPrevious,
    toggleRepeat,
    toggleShuffle,
  };
};

export default useAudioPlayer;
