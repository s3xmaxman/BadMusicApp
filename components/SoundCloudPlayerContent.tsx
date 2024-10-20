import { useState, useRef, useEffect, useCallback, useContext } from "react";
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
import { SoundCloudContext } from "@/providers/SoundCloudProvider";
import { SoundCloudUrls } from "@/constants";

interface SoundCloudPlayerContentProps {
  url: string;
}

const SoundCloudPlayerContent: React.FC<SoundCloudPlayerContentProps> = ({
  url,
}) => {
  const { setCurrentUrl } = useContext(SoundCloudContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSoundCloudIndex, setCurrentSoundCloudIndex] = useState(0);
  const [playOrder, setPlayOrder] = useState<number[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);

  const playNextTrack = useCallback(() => {
    setCurrentSoundCloudIndex((prevIndex) => {
      const currentOrderIndex = playOrder.indexOf(prevIndex);
      const nextOrderIndex = (currentOrderIndex + 1) % playOrder.length;
      const nextIndex = playOrder[nextOrderIndex];
      const nextUrl = SoundCloudUrls[nextIndex].url;
      setCurrentUrl(nextUrl);
      return nextIndex;
    });
    setIsPlaying(true);
  }, [playOrder, setCurrentUrl]);

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
    handleSeekMouseDown,
    handleSeekChange,
    handleSeekMouseUp,
    handleProgress,
    handleDuration,
    handleVolumeChange,
    toggleMute,
  } = useSoundCloudPlayer({ url, onEnded: playNextTrack });

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
  const formattedCurrentTime = formatTime(playedSeconds);
  const formattedDuration = formatTime(duration);

  useEffect(() => {
    setPlayOrder(SoundCloudUrls.map((_, index) => index));
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => !prev);
    setPlayOrder((prevOrder) => {
      if (!isShuffled) {
        const newOrder = [...prevOrder];
        for (let i = newOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
        }
        return newOrder;
      } else {
        return SoundCloudUrls.map((_, index) => index);
      }
    });
  }, [isShuffled]);

  const playPreviousTrack = useCallback(() => {
    setCurrentSoundCloudIndex((prevIndex) => {
      const currentOrderIndex = playOrder.indexOf(prevIndex);
      const previousOrderIndex =
        (currentOrderIndex - 1 + playOrder.length) % playOrder.length;
      const previousIndex = playOrder[previousOrderIndex];
      const previousUrl = SoundCloudUrls[previousIndex].url;
      setCurrentUrl(previousUrl);
      return previousIndex;
    });
    setIsPlaying(true);
  }, [playOrder, setCurrentUrl]);

  const togglePlay = () => {
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
          <FaRandom
            onClick={toggleShuffle}
            size={20}
            className={`cursor-pointer transition ${
              isShuffled ? "text-[#4c1d95]" : "text-neutral-400"
            }`}
          />
          <AiFillStepBackward
            onClick={playPreviousTrack}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div
            onClick={togglePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={playNextTrack}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <BsRepeat1
            onClick={() => setIsLooping((prev) => !prev)}
            size={25}
            className={`cursor-pointer transition ${
              isLooping ? "text-[#4c1d95]" : "text-neutral-400"
            }`}
          />
        </div>

        <div className="flex items-center gap-x-2 mt-4 w-full lg:max-w-[800px] md:max-w-[300px]">
          <span className="w-[50px] text-center inline-block">
            {formattedCurrentTime}
          </span>
          <SeekBar
            currentTime={playedSeconds}
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
        style={{ display: "none" }}
      />
    </div>
  );
};

export default SoundCloudPlayerContent;
