import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaMusic } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { AiOutlineHeart } from "react-icons/ai";
import { Song, SunoSong } from "@/types";
import { IoMdSwap } from "react-icons/io";
import { BackgroundGradient } from "../ui/background-gradient";

interface StandardLayoutProps {
  song: Song | SunoSong;
  imagePath?: string;
  nextSong: Song | SunoSong;
  nextImagePath?: string;
  toggleLayout: () => void;
}

const ON_ANIMATION = 500;

const StandardLayout: React.FC<StandardLayoutProps> = React.memo(
  ({ song, imagePath, nextSong, nextImagePath, toggleLayout }) => {
    const isSunoSong = "audio_url" in song;
    return (
      <div className="scroll-container bg-black text-white p-4 h-full flex flex-col rounded-lg overflow-y-auto">
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleLayout}
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
          >
            <IoMdSwap className="text-white" size={18} />
          </button>
        </div>
        <div className="relative w-full mt-10 aspect-square overflow-hidden rounded-xl">
          <BackgroundGradient className="relative aspect-square overflow-hidden rounded-xl ">
            <Image
              src={imagePath || "/images/loading.jpg"}
              alt="Song Image"
              fill
              className="object-cover shadow-lg transition-all duration-500 ease-in-out"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50">
              <FaMusic className="text-white text-6xl" />
            </div>
          </BackgroundGradient>
        </div>

        <div className="mt-8 space-y-4">
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-3xl font-bold tracking-wide line-clamp-2"
              initial={{ x: song.title.length > ON_ANIMATION ? "100%" : 0 }}
              animate={{ x: 0 }}
              transition={{
                duration: song.title.length > ON_ANIMATION ? 22 : 0,
                repeat: song.title.length > ON_ANIMATION ? Infinity : 0,
                loop: true,
                ease: "linear",
              }}
            >
              <Link
                className="cursor-pointer hover:underline"
                // TODO: sunoへのリンクを追加
                href={`/songs/${song.id}`}
              >
                {song.title || "Untitled"}
              </Link>
            </motion.h1>
            <p className="text-gray-300 mt-1">{song.author}</p>
          </motion.div>

          <div className="flex items-center justify-between">
            <p className=" text-gray-400 text-lg">
              {isSunoSong
                ? song.tags?.split(", ").map((g) => (
                    <Link key={g} href={`/genre/${g}`}>
                      #{g}
                    </Link>
                  ))
                : song.genre?.split(", ").map((g) => (
                    <Link key={g} href={`/genre/${g}`}>
                      #{g}
                    </Link>
                  ))}
            </p>
            <div className="flex items-center gap-2">
              <CiPlay1 size={16} />
              <span>{song.count}</span>
              <AiOutlineHeart size={16} />
              <span> {isSunoSong ? null : song.like_count}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 flex-grow">
          <h2 className="text-white text-xl font-semibold mb-4">次の曲</h2>
          {nextSong && (
            <div className="flex items-center gap-x-4 py-4 rounded-md">
              <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
                <Image
                  src={nextImagePath || "/images/playlist.png"}
                  alt="Next Song"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white line-clamp-1">
                  {nextSong.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-1">
                  {nextSong.author}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

StandardLayout.displayName = "StandardLayout";

export default StandardLayout;
