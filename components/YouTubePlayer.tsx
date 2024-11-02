import React, { memo } from "react";
import ReactPlayer from "react-player/youtube";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as RadixSlider from "@radix-ui/react-slider";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
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
          className="relative flex items-center select-none touch-none w-full h-10 group"
          defaultValue={[1]}
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={100}
          step={1}
          aria-label="Volume"
        >
          <RadixSlider.Track className="relative grow rounded-full h-[3px] bg-neutral-700 group-hover:bg-neutral-600 transition-colors">
            <RadixSlider.Range className="absolute rounded-full h-full bg-white group-hover:bg-white/90 transition-all" />
          </RadixSlider.Track>
          <RadixSlider.Thumb className="hidden group-hover:block h-3 w-3 rounded-full bg-white shadow-sm transition-transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0d0d0d] disabled:pointer-events-none" />
        </RadixSlider.Root>
      );
    };

    return (
      <Card className="w-full max-w-4xl mx-auto bg-[#0d0d0d]  border-neutral-800/50 rounded-xl shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {name}
              </h2>
              <div className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                Live Stream
              </div>
            </div>

            <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 ring-1 ring-white/5">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${videoId}`}
                playing={isPlaying}
                volume={volume / 100}
                controls={false}
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Button
                  onClick={togglePlay}
                  size="icon"
                  variant="ghost"
                  className="h-12 w-12 rounded-full hover:bg-white/5 bg-transparent border border-neutral-800 transition-colors"
                >
                  <Icon className="h-6 w-6 text-white" />
                </Button>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => handleVolumeChange(volume === 0 ? 50 : 0)}
                    size="icon"
                    variant="ghost"
                    className="hover:bg-white/5 bg-transparent"
                  >
                    <VolumeIcon className="h-5 w-5 text-white" />
                  </Button>

                  <div className="w-32">
                    <Slider value={volume} onChange={handleVolumeChange} />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-neutral-400">Live</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
  arePropsEqual
);

YouTubePlayerContent.displayName = "YouTubePlayerContent";

export default YouTubePlayerContent;
