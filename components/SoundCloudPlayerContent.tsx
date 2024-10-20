import { useState, useRef, useEffect } from "react";
import { BsPauseFill, BsPlayFill, BsRepeat1 } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import Image from "next/image";
import SeekBar from "./Seekbar";
import Slider from "./Slider";
import { useSoundCloudPlayer } from "@/hooks/useSoundCloudPlayer";
import ReactPlayer from "react-player";
import { formatTime } from "@/libs/helpers";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

interface SoundCloudPlayerContentProps {
  url: string;
}

const SoundCloudPlayerContent: React.FC<SoundCloudPlayerContentProps> = ({
  url,
}) => {
  const {
    isLooping,
    setIsLooping,
    playedSeconds,
    duration,
    played,
    seeking,
    setSeeking,
    trackImage,
    volume,
    playerRef,
    togglePlay,
    handleSeekMouseDown,
    handleSeekChange,
    handleSeekMouseUp,
    handleProgress,
    handleDuration,
    handleVolumeChange,
    toggleMute,
  } = useSoundCloudPlayer({ url, onEnded: () => {} });

  const [isPlaying, setIsPlaying] = useState(false);
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
  const formattedCurrentTime = formatTime(playedSeconds);
  const formattedDuration = formatTime(duration);

  const handlePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          {trackImage && (
            <Image
              src={trackImage}
              alt="Track Image"
              width={80}
              height={80}
              className="rounded-md"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col w-full md:justify-center items-center max-w-[722px] gap-x-6">
        <div className="flex items-center gap-x-8">
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
        </div>

        <div className="flex items-center gap-x-2 mt-4 w-full lg:max-w-[800px] md:max-w-[300px]">
          <span className="w-[50px] text-center inline-block">
            {formattedCurrentTime}
          </span>
          <SeekBar
            currentTime={0}
            duration={duration}
            onSeek={(time) => playerRef.current?.seekTo(time / duration)}
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
          <Slider value={volume} onChange={handleVolumeChange} />
        </div>
      </div>
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        loop={isLooping}
      />
    </div>
  );
};

export default SoundCloudPlayerContent;
