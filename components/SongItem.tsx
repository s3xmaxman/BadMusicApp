"use client";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CiHeart, CiPlay1 } from "react-icons/ci";

interface SongItemProps {
  onClick: (id: string) => void;
  data: Song;
}

const SongItem: React.FC<SongItemProps> = ({ onClick, data }) => {
  const imagePath = useLoadImage(data);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div
      className="
        relative 
        group 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-xl
        overflow-hidden 
        bg-gradient-to-b 
        from-gray-900/10 
        to-gray-900/20
        cursor-pointer 
        hover:from-gray-800/20 
        hover:to-gray-800/30 
        transition-all 
        duration-300
        aspect-[9/16]
      "
    >
      <div className="relative w-full h-full">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
        )}
        <Image
          className={`object-cover w-full h-full transition-opacity duration-700 transition-transform duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-110`}
          src={imagePath || "/images/wait.jpg"}
          fill
          alt="Image"
          onLoad={() => setIsImageLoaded(true)}
          onClick={() => onClick(data.id)}
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <Link href={`/songs/${data.id}`} className="w-full block">
            <p className="font-medium text-gray-100 truncate text-sm hover:text-gray-300 transition-colors group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {data.title}
            </p>
          </Link>

          <p className="text-gray-400 text-xs mt-1 truncate hover:text-gray-300 transition-colors group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {data.author}
          </p>

          <div className="flex items-center justify-start mt-2 space-x-4">
            <div className="flex items-center text-gray-400 hover:text-gray-300 transition-colors group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              <CiPlay1 size={14} />
              <span className="ml-1 text-xs">{data.count}</span>
            </div>
            <div className="flex items-center text-gray-400 hover:text-gray-300 transition-colors group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              <CiHeart size={14} />
              <span className="ml-1 text-xs">{data.like_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongItem;
