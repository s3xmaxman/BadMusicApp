"use client";

import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsRepeat1 } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";

import { Playlist, SunoSong } from "@/types";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import SeekBar from "./Seekbar";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { useEffect } from "react";
import MobilePlayerContent from "./Mobile/MobilePlayerContent";

interface SunoPlayerContentProps {
  song: SunoSong;
  isMobilePlayer: boolean;
  toggleMobilePlayer: () => void;
  playlists: Playlist[];
}

const SunoPlayerContent: React.FC<SunoPlayerContentProps> = ({
  song,
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
    toggleMute,
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
  } = useAudioPlayer(song?.audio_url);

  useEffect(() => {
    if (audioRef.current && song?.audio_url) {
      audioRef.current.src = song.audio_url;
    }
  }, [song?.audio_url, audioRef]);

  if (!song) return null;

  return (
    <>
      <audio ref={audioRef} src={song.audio_url} loop={isRepeating} />
      <div className="grid grid-cols-2 md:grid-cols-3 h-full">
        <div className="flex w-full justify-start">
          <div className="flex items-center gap-x-4">
            <MediaItem data={song} onClick={toggleMobilePlayer} />
          </div>
        </div>

        <div className="flex md:hidden col-auto w-full justify-end items-center">
          <div
            onClick={handlePlay}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
        </div>

        {/* PC版のレイアウト */}
        <div className="hidden md:flex flex-col w-full md:justify-center items-center max-w-[722px] gap-x-6">
          <div className="flex items-center gap-x-8">
            <FaRandom
              onClick={toggleShuffle}
              size={20}
              className={`cursor-pointer transition ${
                isShuffling ? "text-[#4c1d95]" : "text-neutral-400"
              }`}
            />
            <AiFillStepBackward
              onClick={onPlayPrevious}
              size={30}
              className=" text-neutral-400 cursor-pointer hover:text-white transition"
            />
            <div
              onClick={handlePlay}
              className="flex items-center justify-center h-7 w-7 rounded-full bg-white p-1 cursor-pointer"
            >
              <Icon size={30} className="text-black" />
            </div>
            <AiFillStepForward
              onClick={onPlayNext}
              size={30}
              className=" text-neutral-400 cursor-pointer hover:text-white transition"
            />
            <BsRepeat1
              onClick={toggleRepeat}
              size={25}
              className={`cursor-pointer transition ${
                isRepeating ? "text-[#4c1d95]" : "text-neutral-400"
              }`}
            />
          </div>

          <div className="flex items-center gap-x-2 mt-4 w-full lg:max-w-[800px] md:max-w-[300px]">
            <span className="w-[50px] text-center inline-block">
              {formattedCurrentTime}
            </span>
            <SeekBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              className="flex-1 h-2"
            />
            <span className="w-[50px] text-center inline-block">
              {formattedDuration}
            </span>
          </div>
        </div>

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-full md:w-[170px] lg:w-[200px]">
            <div className="mx-1" />
            <VolumeIcon
              onClick={toggleMute}
              className="cursor-pointer"
              size={34}
            />
            <Slider value={volume} onChange={(value) => setVolume(value)} />
          </div>
        </div>

        {/* モバイル版レイアウト */}
        {/* {isMobilePlayer && (
          <MobilePlayerContent
            song={song}
            playlists={playlists}
            songUrl={song.audio_url}
            imageUrl={song.image_url}
            videoUrl={song.video_url || ""}
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
        )} */}
      </div>
    </>
  );
};

export default SunoPlayerContent;
