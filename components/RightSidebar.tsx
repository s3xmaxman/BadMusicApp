"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";
import { FaMusic } from "react-icons/fa";
import { motion } from "framer-motion";
import { BackgroundGradient } from "./ui/background-gradient";
import { CiPlay1 } from "react-icons/ci";
import { AiOutlineHeart } from "react-icons/ai";
import { IoMdSwap } from "react-icons/io";
import useLoadVideo from "@/hooks/useLoadVideo";

const ON_ANIMATION = 500;

const RightSidebar = () => {
  const [isFullScreenLayout, setIsFullScreenLayout] = useState(false);
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const { song: nextSong } = useGetSongById(player.getNextSongId());
  const videoPath = useLoadVideo(song!);
  const imagePath = useLoadImage(song!);
  const nextImagePath = useLoadImage(nextSong!);

  useEffect(() => {
    if (song && song.video_path) {
      setIsFullScreenLayout(true);
    } else {
      setIsFullScreenLayout(false);
    }
  }, [song]);

  if (!song || !nextSong) {
    return null;
  }

  const toggleLayout = () => {
    setIsFullScreenLayout(!isFullScreenLayout);
  };

  const FullScreenLayout = () => (
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
          layout="fill"
          objectFit="cover"
          className="z-0"
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
            loop: true,
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

      {/* Next Song Preview */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        {nextSong && (
          <div className="flex items-center">
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 mr-4">
              <Image
                src={nextImagePath || "/images/playlist.png"}
                alt="Next Song"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-white line-clamp-1">
                {nextSong.title}
              </h3>
              <p className="text-sm text-gray-300 line-clamp-1">
                {nextSong.author}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Layout Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          onClick={toggleLayout}
          className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IoMdSwap className="text-white" size={24} />
        </motion.button>
      </div>
    </div>
  );

  const StandardLayout = () => (
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
              href={`/songs/${song.id}`}
            >
              {song.title}
            </Link>
          </motion.h1>
          <p className="text-gray-300 mt-1">{song.author}</p>
        </motion.div>

        <div className="flex items-center justify-between">
          <p className=" text-gray-400 text-lg">
            {song?.genre?.split(", ").map((g) => (
              <Link
                key={g}
                className="ml-1 cursor-pointer hover:underline"
                href={`/genre/${g}`}
              >
                #{g}
              </Link>
            ))}
          </p>
          <div className="flex items-center gap-2">
            <CiPlay1 size={16} />
            <span>{song.count}</span>
            <AiOutlineHeart size={16} />
            <span>{song.like_count}</span>
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

  return isFullScreenLayout ? <FullScreenLayout /> : <StandardLayout />;
};

export default RightSidebar;
