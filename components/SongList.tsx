"use client";

import React from "react";
import Image from "next/image";
import { Song } from "@/types";
import usePlayer from "@/hooks/player/usePlayer";
import { useState } from "react";
import useLoadMedia from "@/hooks/data/useLoadMedia";
import { twMerge } from "tailwind-merge";
import { Play, Heart, PlayIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SongListProps {
  data: Song;
  onClick?: (id: string) => void;
  className?: string;
}

const SongList: React.FC<SongListProps> = ({ data, onClick, className }) => {
  const player = usePlayer();
  const imageUrl = useLoadMedia(data, { type: "image", bucket: "images" });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id!);
    }

    if ("author" in data && data.id) {
      return player.setId(data.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className={twMerge(
        `
        flex
        items-center
        gap-x-2
        sm:gap-x-4
        cursor-pointer
        w-full
        bg-gradient-to-r
        from-neutral-900/90
        to-neutral-800/80
        rounded-xl
        p-2
        group
        hover:bg-gradient-to-r
        hover:from-neutral-800/90
        hover:to-neutral-700/80
        transition-all
        duration-300
        backdrop-blur-sm
        border
        border-neutral-800/50
        `,
        className
      )}
    >
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 min-w-12 sm:min-w-16 rounded-lg overflow-hidden group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
        )}
        {imageUrl?.[0] && (
          <Image
            fill
            src={imageUrl[0]}
            alt={data.title}
            className={`object-cover transition-all duration-500 ${
              isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
            } group-hover:scale-110`}
            onLoad={() => setIsImageLoaded(true)}
          />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play size={20} className="text-white" fill="currentColor" />
        </div>
      </div>

      <div className="flex flex-col py-1 truncate flex-grow min-w-0">
        <p className="text-white font-semibold text-xs sm:text-sm truncate tracking-wide">
          {data.title}
        </p>
        <p className="text-neutral-400 text-xs truncate mt-0.5 font-medium">
          {data?.genre}
        </p>
        <p className="text-neutral-500 text-xs truncate mt-0.5 hidden sm:block">
          {data?.author}
        </p>
      </div>

      <div className="flex items-center gap-x-1 sm:gap-x-4 pr-1 sm:pr-4 ml-auto">
        <div className="flex items-center">
          <PlayIcon size={16} className="sm:size-18" />
          <span className="text-neutral-400 text-xs font-semibold ml-1">
            {data?.count}
          </span>
        </div>

        <div className="flex items-center ml-2 sm:ml-0">
          <Heart size={16} className="sm:size-18" />
          <span className="text-neutral-400 text-xs font-semibold ml-1">
            {data?.like_count}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SongList;
