import { useState, useRef, MouseEvent, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Repeat } from "lucide-react";
import ReactPlayer from "react-player";
import Image from "next/image";
import { formatTime } from "@/libs/helpers";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";

interface SoundCloudItemProps {
  data: {
    id: number;
    name: string;
    url: string;
  };
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
}

const SoundCloudItem: React.FC<SoundCloudItemProps> = ({
  data,
  isPlaying,
  onPlay,
  onPause,
  onEnded,
}) => {
  const [isLooping, setIsLooping] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [trackImage, setTrackImage] = useState("");
  const [volume, setVolume] = useState(0.5);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    fetch(
      `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(
        data.url
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.thumbnail_url) {
          setTrackImage(data.thumbnail_url);
        }
      })
      .catch((error) => console.error("Error fetching track info:", error));
  }, [data.url]);

  const togglePlay = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: MouseEvent<HTMLDivElement>) => {
    if (seeking) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newPlayed = (e.clientX - rect.left) / rect.width;

      setPlayed(newPlayed);
      playerRef.current?.seekTo(newPlayed);
    }
  };

  const handleSeekMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    setSeeking(false);
    const rect = e.currentTarget.getBoundingClientRect();
    const newPlayed = (e.clientX - rect.left) / rect.width;

    setPlayed(newPlayed);
    playerRef.current?.seekTo(newPlayed);
  };

  const handleProgress = useCallback(
    ({ played, playedSeconds }: { played: number; playedSeconds: number }) => {
      if (!seeking) {
        setPlayed(played);
        setPlayedSeconds(playedSeconds);
      }

      if (duration > 0 && playedSeconds >= duration - 0.5) {
        if (isLooping) {
          playerRef.current?.seekTo(0);
        } else {
          onEnded();
        }
      }
    },
    [seeking, isLooping, duration, onEnded]
  );

  const handleDuration = (newDuration: number) => {
    setDuration(newDuration);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const toggleMute = () => {
    setVolume((prev) => (prev === 0 ? 0.1 : 0));
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-neutral-400/10 rounded-lg text-card-foreground shadow-sm">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <div className="absolute inset-0">
            <ReactPlayer
              ref={playerRef}
              url={data.url}
              width="100%"
              height="100%"
              volume={volume}
              playing={isPlaying}
              onProgress={handleProgress}
              onDuration={handleDuration}
              onEnded={onEnded}
            />
          </div>
          {/* Control overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <div className="flex items-center space-x-6">
              <button className="bg-white/20 backdrop-blur-md rounded-full p-4 transition-transform duration-300 hover:scale-110">
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-white" />
                ) : (
                  <Play className="w-12 h-12 text-white" />
                )}
              </button>
              <button
                className={`bg-white/20 backdrop-blur-md rounded-full p-3 transition-transform duration-300 hover:scale-110 ${
                  isLooping ? "text-blue-500" : "text-white"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLooping((prev) => !prev);
                }}
              >
                <Repeat className="w-8 h-8" />
              </button>
            </div>
          </div>
          {/* Track image */}
          {trackImage && (
            <div className="absolute bottom-4 left-4 w-20 h-20 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={trackImage}
                alt={data.name}
                width={80}
                height={80}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          )}
        </div>
        {/* Track title */}
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{data.name}</h3>
        </div>
      </CardContent>
      {/* Seek bar and playback time */}
      <div className="p-4 bg-transparent">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {formatTime(playedSeconds)}
          </span>
          <div
            className="relative flex-1 h-2 bg-neutral-300 dark:bg-neutral-600 rounded-full cursor-pointer overflow-hidden"
            onMouseDown={handleSeekMouseDown}
            onMouseMove={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            onMouseLeave={() => setSeeking(false)}
          >
            <div
              className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
              style={{ width: `${played * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {formatTime(duration)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <button
            className={`p-2 rounded-full transition-colors duration-200 ${
              isLooping
                ? "text-blue-500 bg-blue-500/10"
                : "text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
            onClick={() => setIsLooping((prev) => !prev)}
          >
            <Repeat className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <button
              className="p-2 rounded-full text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
              onClick={toggleMute}
            >
              <VolumeIcon className="w-5 h-5" />
            </button>
            <div className="w-24">
              <Slider value={volume} onChange={handleVolumeChange} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SoundCloudItem;
