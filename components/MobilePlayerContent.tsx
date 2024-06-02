import React from "react";
import Image from "next/image";
import { FaRandom } from "react-icons/fa";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { BsRepeat1 } from "react-icons/bs";
import SeekBar from "./Seekbar";
import { Song } from "@/types";
import { RiCloseLine } from "react-icons/ri";
import LikeButton from "./LikeButton";

interface MobilePlayerContentProps {
  song: Song;
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
    <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-neutral-900 text-white px-2 py-4 flex flex-col items-center justify-center">
      <RiCloseLine
        size={32}
        onClick={toggleMobilePlayer}
        className="absolute top-4 left-2 cursor-pointer"
      />
      <div className="flex flex-col items-center h-full w-full justify-evenly">
        <Image
          src={imageUrl || "/images/music-placeholder.png"}
          alt={song.title}
          width={360}
          height={360}
          className="rounded-md mb-4"
        />
        <div className="flex justify-around items-center w-full mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{song.title}</h3>
            <p className="text-gray-400 text-base">{song.author}</p>
          </div>
          <LikeButton songId={song.id} />
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
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            style={{ color: isShuffling ? "green" : "white" }}
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
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            style={{ color: isRepeating ? "green" : "white" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MobilePlayerContent;
