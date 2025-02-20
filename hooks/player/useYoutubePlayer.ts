import { useState } from "react";

/**
 * YouTubeプレイヤーの状態を管理するカスタムフック
 *
 * @param {string} videoId - YouTubeの動画ID
 * @returns {Object} YouTubeプレイヤーの状態と操作関数
 * @property {boolean} isPlaying - 再生中かどうか
 * @property {number} volume - 音量（0〜100）
 * @property {function} togglePlay - 再生/一時停止切り替え関数
 * @property {function} handleVolumeChange - 音量変更関数
 */
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
