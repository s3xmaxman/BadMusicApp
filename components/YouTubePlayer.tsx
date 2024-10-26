import React, { memo } from "react";
import ReactPlayer from "react-player/youtube";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import * as RadixSlider from "@radix-ui/react-slider";
import useYouTubePlayer from "@/hooks/useYoutubePlayer";

interface YouTubePlayerContentProps {
  videoId: string;
  name: string;
}

const arePropsEqual = (
  prevProps: YouTubePlayerContentProps,
  nextProps: YouTubePlayerContentProps
) => {
  return (
    prevProps.videoId === nextProps.videoId && prevProps.name === nextProps.name
  );
};

const YouTubePlayerContent: React.FC<YouTubePlayerContentProps> = memo(
  ({ videoId, name }) => {
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
          step={5}
          aria-label="Volume"
        >
          <RadixSlider.Track className="relative grow rounded-full h-[6px] bg-gray-300">
            <RadixSlider.Range className="absolute rounded-full h-full bg-[#4c1d95]" />
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
        <div className="flex items-center justify-center w-full mt-4 space-x-4">
          <div
            onClick={togglePlay}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={20} className="text-black" />
          </div>
          <div className="flex items-center space-x-2">
            <VolumeIcon
              onClick={() => handleVolumeChange(volume === 0 ? 50 : 0)}
              className="cursor-pointer text-white"
              size={24}
            />
            <div className="w-24">
              <Slider value={volume} onChange={handleVolumeChange} />
            </div>
          </div>
        </div>
      </div>
    );
  },
  arePropsEqual
);

YouTubePlayerContent.displayName = "YouTubePlayerContent";

export default YouTubePlayerContent;
