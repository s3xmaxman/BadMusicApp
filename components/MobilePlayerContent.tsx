import React from "react";
import Image from "next/image";
import { FaRandom } from "react-icons/fa";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { BsRepeat1 } from "react-icons/bs";
import SeekBar from "./Seekbar";
import { Song } from "@/types";
import { RiCloseLine } from "react-icons/ri";

interface MobilePlayerContentProps {
  song: Song;
  songUrl: string;
  imageUrl: string;
  currentTime: number;
  duration: number;
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 text-white p-4">
      <RiCloseLine size={24} onClick={toggleMobilePlayer} />
      <div className="flex flex-col items-center">
        <Image
          src={imageUrl || "/images/music-placeholder.png"}
          alt={song.title}
          width={384}
          height={384}
          className="rounded-md"
        />
        <div className="text-center mb-2">
          <h3 className="text-lg font-semibold">{song.title}</h3>
          <p className="text-sm text-gray-400">{song.author}</p>
        </div>
        <SeekBar
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />
        <div className="flex items-center justify-center gap-x-6 mt-4">
          <FaRandom
            onClick={toggleShuffle}
            size={20}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            style={{ color: isShuffling ? "green" : "white" }}
          />
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30}
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
