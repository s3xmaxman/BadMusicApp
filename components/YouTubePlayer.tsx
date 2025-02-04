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
    const { isPlaying, volume, handleVolumeChange } = useYouTubePlayer(videoId);
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
          <RadixSlider.Thumb className="block md:group-hover:block h-3 w-3 rounded-full bg-white shadow-sm transition-transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0d0d0d] disabled:pointer-events-none" />
        </RadixSlider.Root>
      );
    };

    return (
      <Card className="w-full max-w-4xl mx-auto bg-[#0d0d0d] border-neutral-800/50 rounded-xl md:rounded-2xl shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <h2 className="text-lg md:text-2xl font-bold text-white truncate">
                {name}
              </h2>
              <div className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                Live Stream
              </div>
            </div>

            {/* Video Player */}
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

            {/* Controls Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                {/* Live Status Indicator */}
                <div className="flex items-center gap-2 md:hidden">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-neutral-400">Live</span>
                </div>
              </div>

              {/* Volume Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Button
                    onClick={() => handleVolumeChange(volume === 0 ? 50 : 0)}
                    size="icon"
                    variant="ghost"
                    className="hover:bg-white/5 bg-transparent"
                  >
                    <VolumeIcon className="h-5 w-5 text-white" />
                  </Button>
                  <div className="flex-1 min-w-[100px]">
                    <Slider value={volume} onChange={handleVolumeChange} />
                  </div>
                </div>

                {/* Desktop Live Indicator */}
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-neutral-400">Live</span>
                </div>
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
