"use client";
import React from "react";
import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";
import { FaMusic, FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import LikeButton from "./LikeButton";
import { BackgroundGradient } from "./ui/background-gradient";

const ON_ANIMATION = 500;

const RightSidebar = () => {
  const player = usePlayer();
  const { song: song } = useGetSongById(player.activeId);
  const { song: nextSong } = useGetSongById(player.getNextSongId());

  const imagePath = useLoadImage(song!);
  const nextImagePath = useLoadImage(nextSong!);

  if (!song || !nextSong) {
    return null;
  }

  return (
    <div className="scroll-container bg-gradient-to-b from-gray-900 to-black text-white p-4 h-full flex flex-col rounded-lg overflow-y-auto">
      <div className="relative w-full mt-4 aspect-square overflow-hidden rounded-xl">
        <BackgroundGradient className="relative aspect-square overflow-hidden rounded-xl ">
          <Image
            src={imagePath || "/images/RightSide.png"}
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
            {song.title}
          </motion.h1>
          <p className="text-gray-400 text-lg">#{song.genre}</p>
        </motion.div>

        <div className="flex items-center justify-between">
          <p className="text-gray-300">{song.author}</p>
          <div className="flex items-center gap-2">
            <FaPlay size={13} />
            <span>{song.count}</span>
            <LikeButton songId={song.id} size={18} />
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
};

export default RightSidebar;
