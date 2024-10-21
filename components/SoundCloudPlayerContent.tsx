import React, { useEffect, useRef, useState } from "react";
import { BsPauseFill, BsPlayFill, BsRepeat1 } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import Image from "next/image";
import SeekBar from "./Seekbar";
import Slider from "./Slider";
import ReactPlayer from "react-player";
import { formatTime } from "@/libs/helpers";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { SoundCloudUrls } from "@/constants";
import { useSoundCloudPlayerStore } from "@/hooks/useSoundCloudPlayerStore";

const SoundCloudPlayerContent: React.FC = () => {
  const internalPlayerRef = useRef<ReactPlayer>(null);

  const {
    isPlaying,
    isLooping,
    setIsLooping,
    playedSeconds,
    duration,
    trackImage,
    volume,
    setPlayerRef,
    isShuffled,
    handleProgress,
    handleDuration,
    handleVolumeChange,
    toggleMute,
    fetchTrackInfo,
    playNextTrack,
    playPreviousTrack,
    togglePlay,
    toggleShuffle,
    seekTo,
    currentTitle,
    currentUrl,
  } = useSoundCloudPlayerStore((state) => ({
    isPlaying: state.isPlaying,
    isLooping: state.isLooping,
    setIsLooping: state.setIsLooping,
    playedSeconds: state.playedSeconds,
    duration: state.duration,
    trackImage: state.trackImage,
    volume: state.volume,
    setPlayerRef: state.setPlayerRef,
    isShuffled: state.isShuffled,
    handleProgress: state.handleProgress,
    handleDuration: state.handleDuration,
    handleVolumeChange: state.handleVolumeChange,
    toggleMute: state.toggleMute,
    fetchTrackInfo: state.fetchTrackInfo,
    playNextTrack: state.playNextTrack,
    playPreviousTrack: state.playPreviousTrack,
    togglePlay: state.togglePlay,
    toggleShuffle: state.toggleShuffle,
    seekTo: state.seekTo,
    currentTitle: state.currentTitle,
    currentUrl: state.currentUrl,
  }));

  useEffect(() => {
    setPlayerRef(internalPlayerRef);
  }, [setPlayerRef, internalPlayerRef]);

  useEffect(() => {
    fetchTrackInfo(currentUrl);
  }, [currentUrl, fetchTrackInfo]);

  useEffect(() => {
    useSoundCloudPlayerStore
      .getState()
      .setPlayOrder(SoundCloudUrls.map((_, index) => index));
  }, []);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
  const formattedCurrentTime = formatTime(playedSeconds);
  const formattedDuration = formatTime(duration);

  const splitTitle = (title: string): JSX.Element => {
    if (title.includes("by")) {
      const parts = title.split("by");
      return (
        <span>
          {parts[0]}
          <br />
          by {parts[1]}
        </span>
      );
    } else {
      return <span>{title}</span>;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="cursor-pointer hover:bg-neutral-800/50 p-2 rounded-md flex items-center gap-x-3">
          <div className="relative rounded-md overflow-hidden min-h-[48px] min-w-[48px]">
            <Image
              src={trackImage}
              alt="Track Image"
              fill
              className={`object-cover transition-opacity duration-300 `}
            />
          </div>
          <div className="flex flex-col gap-y-1 overflow-hidden">
            <p className="text-white  truncate">{splitTitle(currentTitle)}</p>
          </div>
        </div>
      </div>

      {/* プレーヤーコントロールセクション */}
      <div className="flex flex-col w-full md:justify-center items-center max-w-[722px] gap-x-6">
        <div className="flex items-center gap-x-8">
          {/* シャッフルボタン */}
          <FaRandom
            onClick={toggleShuffle}
            size={20}
            className={`cursor-pointer transition ${
              isShuffled ? "text-[#4c1d95]" : "text-neutral-400"
            }`}
          />

          {/* 前のトラックボタン */}
          <AiFillStepBackward
            onClick={playPreviousTrack}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />

          {/* 再生/一時停止ボタン */}
          <div
            onClick={togglePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>

          {/* 次のトラックボタン */}
          <AiFillStepForward
            onClick={playNextTrack}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />

          {/* ループボタン */}
          <BsRepeat1
            onClick={() => setIsLooping(!isLooping)}
            size={25}
            className={`cursor-pointer transition ${
              isLooping ? "text-[#4c1d95]" : "text-neutral-400"
            }`}
          />
        </div>

        {/* シークバーセクション */}
        <div className="flex items-center gap-x-2 mt-4 w-full lg:max-w-[800px] md:max-w-[300px]">
          <span className="w-[50px] text-center inline-block">
            {formattedCurrentTime}
          </span>
          <SeekBar
            currentTime={playedSeconds}
            duration={duration}
            onSeek={seekTo}
            className="flex-1 h-2"
          />
          <span className="w-[50px] text-center inline-block">
            {formattedDuration}
          </span>
        </div>
      </div>

      {/* ボリュームコントロールセクション */}
      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-full md:w-[170px] lg:w-[200px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={34}
          />
          <Slider value={volume} onChange={handleVolumeChange} />
        </div>
      </div>

      {/* ReactPlayerコンポーネント */}
      <ReactPlayer
        key={currentUrl}
        ref={internalPlayerRef}
        url={currentUrl}
        playing={isPlaying}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={playNextTrack}
        loop={false}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default SoundCloudPlayerContent;
