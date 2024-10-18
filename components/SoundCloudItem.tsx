import { useState, useRef, MouseEvent, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Repeat } from "lucide-react";
import ReactPlayer from "react-player";
import Image from "next/image";

interface SoundCloudItemProps {
  data: {
    id: number;
    name: string;
    url: string;
  };
}

const SoundCloudItem: React.FC<SoundCloudItemProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [trackImage, setTrackImage] = useState("");

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
    setIsPlaying((prev) => !prev);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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

      // Check if the track has ended
      if (duration > 0 && playedSeconds >= duration - 0.5) {
        if (isLooping) {
          playerRef.current?.seekTo(0);
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      }
    },
    [seeking, isLooping, duration]
  );

  const handleDuration = (newDuration: number) => {
    setDuration(newDuration);
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
              volume={0.1}
              playing={isPlaying}
              onProgress={handleProgress}
              onDuration={handleDuration}
            />
          </div>
          {/* Control overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <div className="flex items-center space-x-4">
              {isPlaying ? (
                <Pause className="w-16 h-16 text-white" />
              ) : (
                <Play className="w-16 h-16 text-white" />
              )}
              <div
                className={`cursor-pointer ${
                  isLooping ? "text-blue-500" : "text-white"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLooping((prev) => !prev);
                }}
              >
                <Repeat className="w-10 h-10" />
              </div>
            </div>
          </div>
          {/* Track image */}
          {trackImage && (
            <div className="absolute bottom-2 left-2 w-16 h-16 rounded-md overflow-hidden">
              <Image
                src={trackImage}
                alt={data.name}
                width={64}
                height={64}
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
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <span>{formatTime(playedSeconds)}</span>
          <div
            className="relative flex-1 h-2 bg-gray-300 cursor-pointer"
            onMouseDown={handleSeekMouseDown}
            onMouseMove={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            onMouseLeave={() => setSeeking(false)}
          >
            <div
              className="absolute top-0 left-0 h-2 bg-blue-500"
              style={{ width: `${played * 100}%` }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <div
            className={`cursor-pointer ${
              isLooping ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setIsLooping((prev) => !prev)}
          >
            <Repeat className="w-6 h-6" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SoundCloudItem;
