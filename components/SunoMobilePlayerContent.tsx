import React, { useState } from "react";
import Image from "next/image";
import { FaRandom } from "react-icons/fa";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill, BsRepeat1 } from "react-icons/bs";
import Link from "next/link";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Playlist, SunoSong } from "@/types";
import SeekBar from "./Seekbar";
import MobileStyleIcons from "./Mobile/MobileStyleIcons";
import LyricsDrawer from "./Mobile/LyricsDrawer";

interface SunoMobilePlayerContentProps {
  song: SunoSong;
  playlists: Playlist[];
  songUrl: string;
  currentTime: number;
  duration: number;
  formattedCurrentTime: string;
  formattedDuration: string;
  isPlaying: boolean;
  isShuffling: boolean;
  isRepeating: boolean;
  handlePlay: () => void;
  handleSeek: (time: number) => void;
  toggleMobilePlayer: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
}

const SunoMobilePlayerContent = ({
  song,
  playlists,
  songUrl,
  currentTime,
  formattedCurrentTime,
  formattedDuration,
  duration,
  isPlaying,
  isShuffling,
  isRepeating,
  handlePlay,
  handleSeek,
  toggleShuffle,
  toggleRepeat,
  toggleMobilePlayer,
  onPlayNext,
  onPlayPrevious,
}: SunoMobilePlayerContentProps) => {
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const [showLyrics, setShowLyrics] = useState(false);
  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  const bind = useDrag(
    ({ down, movement: [mx, my] }) => {
      api.start({ y: down ? my : 0, immediate: down });
      if (!down && my > 50) {
        toggleMobilePlayer();
      }
    },
    { axis: "y", bounds: { top: 0 } }
  );

  return (
    <animated.div
      {...bind()}
      style={{
        y,
        touchAction: "none",
      }}
      className="md:hidden fixed inset-0 bg-black text-white"
    >
      <div className="relative w-full h-full ">
        {song.video_url ? (
          <video
            className=" w-full h-full object-cover"
            src={song.video_url}
            muted
            autoPlay
            loop
          />
        ) : (
          <Image
            src={song.image_url || "/images/wait.jpg"}
            alt={song.title}
            layout="fill"
            objectFit="cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90" />
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex-1" />

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="max-w-[70%]">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg truncate">
                  {song.title}
                </h1>
                <p className="text-lg text-gray-200 drop-shadow-lg mt-1 truncate">
                  {song.author}
                </p>
                <div className="flex flex-wrap mb-2 mt-2">
                  {song.tags && (
                    <span className="mr-2 text-sm bg-white/20 text-white px-2 py-1 rounded-full">
                      #{song.tags}
                    </span>
                  )}
                </div>
              </div>
              <MobileStyleIcons
                toggleLyrics={toggleLyrics}
                playlists={playlists}
                songId={song.id}
                songType="suno"
              />
            </div>

            <div className="space-y-2">
              <SeekBar
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                className="w-full h-1"
              />

              <div className="flex justify-between items-center text-xs text-gray-300">
                <span>{formattedCurrentTime}</span>
                <span>{formattedDuration}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <FaRandom
                onClick={toggleShuffle}
                size={22}
                className={`cursor-pointer transition ${
                  isShuffling ? "text-[#4c1d95]" : "text-gray-400"
                }`}
              />
              <AiFillStepBackward
                onClick={onPlayPrevious}
                size={28}
                className="text-gray-400 cursor-pointer hover:text-white transition"
              />
              <div
                onClick={handlePlay}
                className="flex items-center justify-center h-16 w-16 rounded-full bg-[#4c1d95] cursor-pointer shadow-lg hover:bg-[#5d2ca6] transition-colors"
              >
                <Icon size={28} className="text-white" />
              </div>
              <AiFillStepForward
                onClick={onPlayNext}
                size={28}
                className="text-gray-400 cursor-pointer hover:text-white transition"
              />
              <BsRepeat1
                onClick={toggleRepeat}
                size={28}
                className={`cursor-pointer transition ${
                  isRepeating ? "text-[#4c1d95]" : "text-gray-400"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
      <LyricsDrawer
        showLyrics={showLyrics}
        toggleLyrics={toggleLyrics}
        lyrics={song.lyric || ""}
      />
    </animated.div>
  );
};

export default SunoMobilePlayerContent;
