"use client";

import type React from "react";

import Image from "next/image";
import type { Song } from "@/types";
import usePlayer from "@/hooks/player/usePlayer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useLoadMedia from "@/hooks/data/useLoadMedia";
import { twMerge } from "tailwind-merge";
import { Play, Heart, Music2, PlayIcon } from "lucide-react";
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
        gap-x-4
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
      <div className="relative w-16 h-16 min-w-16 rounded-lg overflow-hidden group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
        )}
        <Image
          fill
          src={imageUrl?.[0]! || "/placeholder.svg"}
          alt={data.title}
          className={`object-cover transition-all duration-500 ${
            isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
          } group-hover:scale-110`}
          onLoad={() => setIsImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play size={24} className="text-white" fill="currentColor" />
        </div>
      </div>

      <div className="flex flex-col py-1 truncate flex-grow">
        <p className="text-white font-semibold text-sm truncate tracking-wide">
          {data.title}
        </p>
        <p className="text-neutral-400 text-xs truncate mt-1 font-medium">
          {data?.genre}
        </p>
        <p className="text-neutral-500 text-xs truncate mt-0.5">
          {data?.author}
        </p>
      </div>

      <div className="flex items-center gap-x-4 pr-4">
        <PlayIcon size={18} />
        <span className="text-neutral-400 text-xs font-semibold">
          {data?.count}
        </span>

        <Heart size={18} />
        <span className="text-neutral-400 text-xs font-semibold">
          {data?.like_count}
        </span>
      </div>
    </motion.div>
  );
};

export default SongList;
