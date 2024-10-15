"use client";
import React from "react";
import ReactPlayer from "react-player/youtube";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import * as RadixSlider from "@radix-ui/react-slider";

import useYouTubePlayer from "@/hooks/useYoutubePlayer";

interface YouTubePlayerContentProps {
  videoId: string;
  name: string;
}

const YouTubePlayerContent: React.FC<YouTubePlayerContentProps> = ({
  videoId,
  name,
}) => {
  const { isPlaying, volume, togglePlay, handleVolumeChange } =
    useYouTubePlayer(videoId);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const Slider = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => {
    return (
      <RadixSlider.Root
        className="relative flex items-center select-none touch-none w-full h-10"
        defaultValue={[1]}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={100}
        step={10}
        aria-label="Volume"
      >
        <RadixSlider.Track className=" relative grow rounded-full h-[6px] bg-gray-300">
          <RadixSlider.Range className=" absolute rounded-full h-full bg-[#4c1d95]" />
        </RadixSlider.Track>
      </RadixSlider.Root>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <h2 className="text-white text-2xl font-semibold mb-4">{name}</h2>
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${videoId}`}
        playing={isPlaying}
        volume={volume / 100}
        controls={false}
        width="100%"
        height="100%"
      />
      <div className="flex items-center justify-between w-full mt-4">
        <div
          onClick={togglePlay}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon size={30} className="text-black" />
        </div>
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={() => handleVolumeChange(volume === 0 ? 50 : 0)}
            className="cursor-pointer"
            size={34}
          />
          <Slider
            value={volume}
            onChange={(value) => handleVolumeChange(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayerContent;
