import { useEffect, useState, useRef, useMemo } from "react";
import usePlayer from "@/hooks/player/usePlayer";
import { isMobile } from "react-device-detect";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

/**
 * オーディオプレイヤーの状態と操作を管理するカスタムフック
 *
 * @param {string} songUrl - 再生する曲のURL
 * @returns {Object} プレイヤーの状態と操作関数を含むオブジェクト
 * @property {React.ComponentType} Icon - 再生/一時停止アイコン
 * @property {React.ComponentType} VolumeIcon - 音量アイコン
 * @property {string} formattedCurrentTime - フォーマットされた現在の再生時間
 * @property {string} formattedDuration - フォーマットされた曲の長さ
 * @property {function} toggleMute - ミュート切り替え関数
 * @property {number} volume - 現在の音量
 * @property {function} setVolume - 音量設定関数
 * @property {React.RefObject} audioRef - オーディオ要素への参照
 * @property {number} currentTime - 現在の再生時間（秒）
 * @property {number} duration - 曲の長さ（秒）
 * @property {boolean} isPlaying - 再生中かどうか
 * @property {boolean} isRepeating - リピート再生中かどうか
 * @property {boolean} isShuffling - シャッフル再生中かどうか
 * @property {function} handlePlay - 再生/一時停止切り替え関数
 * @property {function} handleSeek - シーク操作関数
 * @property {function} onPlayNext - 次の曲を再生する関数
 * @property {function} onPlayPrevious - 前の曲を再生する関数
 * @property {function} toggleRepeat - リピート切り替え関数
 * @property {function} toggleShuffle - シャッフル切り替え関数
 */
const useAudioPlayer = (songUrl: string) => {
  const player = usePlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(isMobile ? 1 : 0.1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isRepeating = usePlayer((state) => state.isRepeating);
  const isShuffling = usePlayer((state) => state.isShuffling);

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
      player.setId(nextSongId);
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
        player.setId(prevSongId);
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

  const handleVolumeClick = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  return {
    Icon,
    VolumeIcon,
    formattedCurrentTime,
    formattedDuration,
    volume,
    setVolume,
    showVolumeSlider,
    setShowVolumeSlider,
    handleVolumeClick,
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
