import React, { useState } from "react";
import Image from "next/image";
import { FaRandom } from "react-icons/fa";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { BsRepeat1 } from "react-icons/bs";
import SeekBar from "./Seekbar";
import { Playlist, Song } from "@/types";
import { RiCloseLine } from "react-icons/ri";
import LikeButton from "./LikeButton";
import AddPlaylist from "./AddPlaylist";
import { BackgroundGradient } from "./ui/background-gradient";
import Link from "next/link";

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

const MobilePlayerContent: React.FC<MobilePlayerContentProps> = ({
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
}) => {
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const [showLyrics, setShowLyrics] = useState(false);

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-gray-900 to-black text-white px-4 py-6 flex flex-col items-center justify-between">
      <RiCloseLine
        size={25}
        onClick={toggleMobilePlayer}
        className="absolute top-4 left-4 cursor-pointer"
      />
      <div className="w-full max-w-sm flex flex-col items-center justify-between h-full">
        <div
          className="flip-container w-full aspect-square perspective-1000 cursor-pointer mb-4"
          onClick={toggleLyrics}
        >
          <div
            className={`flipper relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
              showLyrics ? "rotate-y-180" : ""
            }`}
          >
            <div className="front absolute w-full h-full backface-hidden">
              <BackgroundGradient className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={imageUrl || "/images/music-placeholder.png"}
                  alt={song.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
              </BackgroundGradient>
            </div>
            <div className="back absolute w-full h-full backface-hidden rotate-y-180 bg-gray-800 rounded-2xl p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{song.title}</h2>
              <p className="text-gray-400 mb-4">{song.author}</p>
              <div className="lyrics-content text-sm leading-relaxed">
                {song.lyrics?.split("\n").map((line, index) => (
                  <p key={index} className="mb-2">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold">{song.title}</h1>
              <p className="text-sm text-gray-400">{song.author}</p>
            </div>
            <div className="flex items-center space-x-4">
              <AddPlaylist playlists={playlists} songId={song.id} />
              <LikeButton songId={song.id} />
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">{formattedCurrentTime}</span>
            <SeekBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              className="w-3/4 h-1"
            />
            <span className="text-sm">{formattedDuration}</span>
          </div>
          <div className="flex items-center justify-between">
            <FaRandom
              onClick={toggleShuffle}
              size={20}
              className={`cursor-pointer transition ${
                isShuffling ? "text-[#4c1d95]" : "text-gray-400"
              }`}
            />
            <AiFillStepBackward
              onClick={onPlayPrevious}
              size={24}
              className="text-gray-400 cursor-pointer hover:text-white transition"
            />
            <div
              onClick={handlePlay}
              className="flex items-center justify-center h-14 w-14 rounded-full bg-[#4c1d95] cursor-pointer"
            >
              <Icon size={24} className="text-white" />
            </div>
            <AiFillStepForward
              onClick={onPlayNext}
              size={24}
              className="text-gray-400 cursor-pointer hover:text-white transition"
            />
            <BsRepeat1
              onClick={toggleRepeat}
              size={20}
              className={`cursor-pointer transition ${
                isRepeating ? "text-[#4c1d95]" : "text-gray-400"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayerContent;
