import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CiPlay1 } from "react-icons/ci";
import { AiOutlineHeart } from "react-icons/ai";
import { IoMdSwap } from "react-icons/io";
import { Song } from "@/types";

interface CurrentSongDisplayProps {
  song: Song;
  videoPath?: string;
  imagePath?: string;
  toggleLayout: () => void;
}

const ON_ANIMATION = 500;

const CurrentSongDisplay: React.FC<CurrentSongDisplayProps> = React.memo(
  ({ song, videoPath, imagePath, toggleLayout }) => {
    return (
      <div className="relative w-full h-full overflow-hidden">
        {song.video_path ? (
          <video
            src={videoPath!}
            autoPlay
            loop
            muted
            className="z-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={imagePath || "/images/loading.jpg"}
            alt="Song Image"
            fill
            className="z-0 object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-10" />

        {/* Current Song Info */}
        <motion.div
          className="absolute bottom-20 left-0 right-0 p-6 z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl font-bold tracking-wide line-clamp-2 text-white mb-2"
            initial={{ x: song.title.length > ON_ANIMATION ? "100%" : 0 }}
            animate={{ x: 0 }}
            transition={{
              duration: song.title.length > ON_ANIMATION ? 22 : 0,
              repeat: song.title.length > ON_ANIMATION ? Infinity : 0,
              ease: "linear",
            }}
          >
            <Link
              className="cursor-pointer hover:underline"
              href={`/songs/${song.id}`}
            >
              {song.title}
            </Link>
          </motion.h1>
          <p className="text-gray-300 text-xl mb-4">{song.author}</p>
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-lg">
              {song?.genre?.split(", ").map((g) => (
                <Link
                  key={g}
                  className="mr-2 cursor-pointer hover:underline"
                  href={`/genre/${g}`}
                >
                  #{g}
                </Link>
              ))}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <CiPlay1 size={24} className="text-white mr-1" />
                <span className="text-white text-lg">{song.count}</span>
              </div>
              <div className="flex items-center">
                <AiOutlineHeart size={24} className="text-white mr-1" />
                <span className="text-white text-lg">{song.like_count}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Layout Toggle Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleLayout}
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
          >
            <IoMdSwap className="text-white" size={24} />
          </button>
        </div>
      </div>
    );
  }
);

CurrentSongDisplay.displayName = "CurrentSongDisplay";

export default CurrentSongDisplay;
