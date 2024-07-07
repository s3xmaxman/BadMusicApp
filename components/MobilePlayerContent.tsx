import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FaRandom } from "react-icons/fa";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { LiaMicrophoneAltSolid } from "react-icons/lia";
import { BsPauseFill, BsPlayFill, BsRepeat1 } from "react-icons/bs";
import { RiPlayListAddFill } from "react-icons/ri";
import SeekBar from "./Seekbar";
import { Playlist, Song } from "@/types";
import LikeButton from "./LikeButton";
import AddPlaylist from "./AddPlaylist";
import Link from "next/link";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import LyricsDrawer from "./LyricsDrawer";
import MobileStyleIcons from "./MobileStyleIcons";

interface MobilePlayerContentProps {
  song: Song;
  playlists: Playlist[];
  songUrl: string;
  imageUrl: string;
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

const MobilePlayerContent = ({
  song,
  playlists,
  songUrl,
  imageUrl,
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
}: MobilePlayerContentProps) => {
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const [showLyrics, setShowLyrics] = useState(false);

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx, my], velocity }) => {
      if (!showLyrics) {
        api.start({ y: down ? my : 0, immediate: down });
        if (!down && my > 50) {
          toggleMobilePlayer();
        }
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
      <div className="relative w-full h-full">
        <Image
          src={imageUrl || "/images/wait.jpg"}
          alt={song.title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />

        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="w-full h-1 bg-white/20 rounded-full" />

          <div className="flex-1" />

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="max-w-[70%]">
                <Link href={`/songs/${song.id}`}>
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg hover:underline truncate">
                    {song.title}
                  </h1>
                </Link>
                <p className="text-lg text-gray-200 drop-shadow-lg mt-1 truncate">
                  {song.author}
                </p>
                <div className="flex flex-wrap mb-2 mt-2">
                  {song?.genre
                    ?.split(", ")
                    .slice(0, 2)
                    .map((g) => (
                      <Link
                        key={g}
                        className="mr-2 text-sm bg-white/20 text-white px-2 py-1 rounded-full hover:bg-white/30 transition-colors"
                        href={`/genre/${g}`}
                      >
                        #{g}
                      </Link>
                    ))}
                </div>
              </div>
              <MobileStyleIcons
                toggleLyrics={toggleLyrics}
                playlists={playlists}
                songId={song.id}
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
        lyrics={song.lyrics || ""}
      />
    </animated.div>
  );
};

export default MobilePlayerContent;
