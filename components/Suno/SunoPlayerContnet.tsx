"use client";

import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsRepeat1 } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";

import { Playlist, SunoSong } from "@/types";
import MediaItem from "../MediaItem";
import Slider from "../Slider";
import SeekBar from "../Seekbar";
import useAudioPlayer from "@/hooks/audio/useAudioPlayer";
import { useEffect } from "react";

import LikeButton from "../LikeButton";
import SunoMobilePlayerContent from "./SunoMobilePlayerContent";
import AddPlaylist from "../AddPlaylist";

interface SunoPlayerContentProps {
  song: SunoSong;
  songUrl: string;
  isMobilePlayer: boolean;
  toggleMobilePlayer: () => void;
  playlists: Playlist[];
}

const SunoPlayerContent: React.FC<SunoPlayerContentProps> = ({
  song,
  songUrl,
  isMobilePlayer,
  toggleMobilePlayer,
  playlists,
}) => {
  const {
    Icon,
    VolumeIcon,
    formattedCurrentTime,
    formattedDuration,
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
    showVolumeSlider,
    setShowVolumeSlider,
    handleVolumeClick,
  } = useAudioPlayer(songUrl);

  useEffect(() => {
    if (audioRef.current && songUrl) {
      audioRef.current.src = songUrl;
    }
  }, [songUrl, audioRef]);

  useEffect(() => {
    if (!showVolumeSlider) return;

    const timeout = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showVolumeSlider]);

  if (!song) return null;

  return (
    <>
      <audio ref={audioRef} src={songUrl} loop={isRepeating} />
      <div className="grid grid-cols-2 md:grid-cols-3 h-full from-[#000000] to-[#04000b]">
        <div className="flex w-full justify-start">
          <div className="flex items-center gap-x-4">
            <MediaItem data={song} onClick={toggleMobilePlayer} />
          </div>
        </div>

        <div className="flex md:hidden col-auto w-full justify-end items-center">
          <div
            onClick={handlePlay}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#08101f] to-[#0d0d0d] p-1 cursor-pointer group"
          >
            <Icon
              size={30}
              className="text-[#f0f0f0] group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          </div>
        </div>

        <div className="hidden md:flex flex-col w-full md:justify-center items-center max-w-[722px] gap-x-6">
          <div className="flex items-center gap-x-8">
            <FaRandom
              onClick={toggleShuffle}
              size={20}
              className={`cursor-pointer transition-all duration-300 hover:filter hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] ${
                isShuffling
                  ? "text-[#4c1d95] drop-shadow-[0_0_8px_rgba(76,29,149,0.6)] hover:drop-shadow-[0_0_12px_rgba(76,29,149,0.8)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            />
            <AiFillStepBackward
              onClick={onPlayPrevious}
              size={30}
              className="text-neutral-400 cursor-pointer hover:text-white hover:filter hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"
            />
            <div
              onClick={handlePlay}
              className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-[#08101f] to-[#0d0d0d] p-1 cursor-pointer group"
            >
              <Icon
                size={30}
                className="text-[#f0f0f0] group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
            </div>
            <AiFillStepForward
              onClick={onPlayNext}
              size={30}
              className="text-neutral-400 cursor-pointer hover:text-white hover:filter hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"
            />
            <BsRepeat1
              onClick={toggleRepeat}
              size={25}
              className={`cursor-pointer transition-all duration-300 hover:filter hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] ${
                isRepeating
                  ? "text-[#4c1d95] drop-shadow-[0_0_8px_rgba(76,29,149,0.6)] hover:drop-shadow-[0_0_12px_rgba(76,29,149,0.8)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            />
          </div>

          <div className="flex items-center gap-x-2 mt-4 w-full lg:max-w-[800px] md:max-w-[300px]">
            <span className="w-[50px] text-center inline-block text-[#f0f0f0]">
              {formattedCurrentTime}
            </span>
            <SeekBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              className="flex-1 h-2"
            />
            <span className="w-[50px] text-center inline-block text-[#f0f0f0]">
              {formattedDuration}
            </span>
          </div>
        </div>

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-8 w-full md:w-[170px] lg:w-[200px]">
            <AddPlaylist
              playlists={playlists}
              songId={song.id}
              songType="suno"
            />
            <LikeButton songId={song.id} songType="suno" />
            <div className="relative">
              <VolumeIcon
                onClick={handleVolumeClick}
                className="cursor-pointer text-neutral-400 hover:text-white hover:filter hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"
                size={22}
              />
              <div
                className={`absolute bottom-full mb-3 ml-1 transition-opacity duration-200 z-50 ${
                  showVolumeSlider ? "opacity-100" : "opacity-0"
                }`}
              >
                <Slider value={volume} onChange={(value) => setVolume(value)} />
              </div>
            </div>
          </div>
        </div>

        {isMobilePlayer && (
          <SunoMobilePlayerContent
            song={song}
            playlists={playlists}
            songUrl={songUrl}
            currentTime={currentTime}
            duration={duration}
            formattedCurrentTime={formattedCurrentTime}
            formattedDuration={formattedDuration}
            isPlaying={isPlaying}
            isShuffling={isShuffling}
            isRepeating={isRepeating}
            handlePlay={handlePlay}
            handleSeek={handleSeek}
            toggleMobilePlayer={toggleMobilePlayer}
            toggleShuffle={toggleShuffle}
            toggleRepeat={toggleRepeat}
            onPlayNext={onPlayNext}
            onPlayPrevious={onPlayPrevious}
          />
        )}
      </div>
    </>
  );
};

export default SunoPlayerContent;
