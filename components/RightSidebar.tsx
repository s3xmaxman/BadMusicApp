"use client";
import React from "react";
import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";
import { FaMusic } from "react-icons/fa";
import LikeButton from "./LikeButton";
import { motion } from "framer-motion";

const ON_ANIMATION = 20;

const RightSidebar = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const imagePath = useLoadImage(song!);
  const nextSongId = player.getNextSongId();
  const { song: nextSong } = useGetSongById(nextSongId);
  const nextImagePath = useLoadImage(nextSong!);

  if (!song || !nextSong) {
    return null;
  }

  return (
    <div className="scroll-container bg-gradient-to-b bg-natural-900 text-white p-4 h-full flex flex-col rounded-lg overflow-y-auto">
      <div className="relative w-full mt-4">
        <Image
          src={imagePath || "/images/RightSide.png"}
          alt="Song Image"
          layout="responsive"
          width={800}
          height={800}
          className="object-cover rounded-xl shadow-lg transition-all duration-500 ease-in-out"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <FaMusic className="text-white text-6xl" />
        </div>
      </div>
      <div className="mt-8 w-full flex flex-col items-start">
        <div>
          {song.title.length > ON_ANIMATION ? (
            <motion.div
              className="flex items-center"
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{
                duration: 22,
                repeat: Infinity,
                loop: true,
                ease: "linear",
              }}
            >
              <h1 className="text-3xl font-bold tracking-wide song-title">
                {song.title}
              </h1>
            </motion.div>
          ) : (
            <h1 className="text-3xl font-bold tracking-wide song-title">
              {song.title}
            </h1>
          )}
          <p className="ml-2 text-gray-400 text-lg underline">#{song.genre}</p>
        </div>
        <div className="flex items-center mt-2">
          <p className="text-lg text-gray-300 mr-[200px]">{song.author}</p>
          <LikeButton songId={song.id} />
        </div>
      </div>
      <div className="sticky mt-[130px] w-full mb-10">
        <span className="ml-2text-white text-xl font-semibold">次の曲</span>
        {nextSong && (
          <div className="w-full flex items-center gap-x-16 cursor-pointer hover:bg-neutral-800 rounded-md p-3">
            <Image
              src={nextImagePath || "/images/playlist.png"}
              alt="Next Song"
              width={100}
              height={100}
              className="rounded-xl"
            />
            <div>
              <h2 className="text-lg font-semibold text-white">
                {nextSong.title}
              </h2>
              <p className="text-sm text-neutral-400">{nextSong.author}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
