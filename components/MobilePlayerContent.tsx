import React from "react";
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
import { CiHeart, CiPlay1 } from "react-icons/ci";

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

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-gray-900 to-black text-white px-2 py-4 flex flex-col items-center justify-center">
      <RiCloseLine
        size={25}
        onClick={toggleMobilePlayer}
        className="absolute top-2 left-2 cursor-pointer"
      />
      <div className="flex flex-col items-center h-full w-full justify-evenly">
        <BackgroundGradient className="relative aspect-square overflow-hidden rounded-xl ">
          <Image
            src={imageUrl || "/images/music-placeholder.png"}
            alt={song.title}
            width={300}
            height={300}
            className="rounded-xl mb-4"
          />
        </BackgroundGradient>
        <div className="flex justify-around items-center w-full mb-4">
          <div>
            <h1 className="text-xl font-semibold mb-1">{song.title}</h1>
            {song?.genre?.split(", ").map((g) => (
              <Link
                key={g}
                className="ml-1 cursor-pointer hover:underline"
                href={`/genre/${g}`}
              >
                <span>#{g}</span>
              </Link>
            ))}
            <p className="text-gray-400 text-base mt-2">{song.author}</p>
          </div>
          <div className="flex items-center space-x-4">
            <AddPlaylist playlists={playlists} songId={song.id} />
            <LikeButton songId={song.id} />
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <span className="w-[40px] text-center inline-block">
            {formattedCurrentTime}
          </span>
          <SeekBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            className="w-[200px] h-2"
          />
          <span className="w-[40px] text-center inline-block">
            {formattedDuration}
          </span>
        </div>
        <div className="flex items-center justify-center gap-x-8 mt-4">
          <FaRandom
            onClick={toggleShuffle}
            size={20}
            className={`cursor-pointer transition ${
              isShuffling ? "text-[#4c1d95]" : "text-neutral-400"
            }`}
          />
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={32}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-12 w-12 rounded-full bg-white p-2 cursor-pointer"
          >
            <Icon size={32} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={32}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <BsRepeat1
            onClick={toggleRepeat}
            size={20}
            className={`cursor-pointer transition ${
              isRepeating ? "text-[#4c1d95]" : "text-neutral-400"
            }`}
          />
          <div className="absolute bottom-2 right-2 flex items-center space-x-2">
            <div className="flex items-center space-x-1.5">
              <CiPlay1 size={14} className="text-white" />
              <span className="text-white">{song.count}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CiHeart size={14} className="text-white" />
              <span className="text-white">{song.like_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayerContent;
