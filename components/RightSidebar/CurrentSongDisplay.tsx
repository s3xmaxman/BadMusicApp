import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CiPlay1 } from "react-icons/ci";
import { AiOutlineHeart } from "react-icons/ai";
import { IoMdSwap } from "react-icons/io";
import { BiChevronRight } from "react-icons/bi";
import { Song, SunoSong } from "@/types";
import { splitTags } from "@/libs/utils";

interface CurrentSongDisplayProps {
  song: Song | SunoSong;
  videoPath?: string;
  imagePath?: string;
  toggleLayout: () => void;
}

const ON_ANIMATION = 500;
const MAX_VISIBLE_TAGS = 3;

const CurrentSongDisplay: React.FC<CurrentSongDisplayProps> = React.memo(
  ({ song, videoPath, imagePath, toggleLayout }) => {
    const [showAllTags, setShowAllTags] = useState(false);

    const isSunoSong = "audio_url" in song;
    const tags = isSunoSong ? splitTags(song.tags) : splitTags(song.genre);

    const uniqueTags = Array.from(new Set(tags));
    const visibleTags = showAllTags
      ? uniqueTags
      : uniqueTags.slice(0, MAX_VISIBLE_TAGS);
    const hasMoreTags = tags.length > MAX_VISIBLE_TAGS;

    return (
      <div className="relative w-full h-full">
        {(isSunoSong ? song.video_url : song.video_path) ? (
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black " />

        {/* Current Song Info */}
        <motion.div
          className="absolute bottom-20 left-0 right-0 p-6 "
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
              href={isSunoSong ? `/suno-songs/${song.id}` : `/songs/${song.id}`}
            >
              {song.title}
            </Link>
          </motion.h1>
          <p className="text-gray-300 text-xl mb-4">{song.author}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-gray-400 text-lg max-w-[70%]">
              {visibleTags.map((tag, index) => (
                <Link
                  key={tag}
                  href={isSunoSong ? `/tag/${tag}` : `/genre/${tag}`}
                  className="bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  {tag}
                </Link>
              ))}
              {hasMoreTags && !showAllTags && (
                <button
                  onClick={() => setShowAllTags(true)}
                  className="flex items-center bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  +{tags.length - MAX_VISIBLE_TAGS}
                  <BiChevronRight className="ml-1" />
                </button>
              )}
            </div>
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
        <div className="absolute top-4 right-4">
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
