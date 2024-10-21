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
        rounded-md 
        overflow-hidden 
        gap-x-4 
        bg-neutral-400/5 
        cursor-pointer 
        hover:bg-neutral-400/10 
        transition 
        p-3
        "
    >
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
        )}
        <Image
          className={`object-cover w-full h-full transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={imagePath || "/images/wait.jpg"}
          fill
          alt="Image"
          onLoad={() => setIsImageLoaded(true)}
          onClick={() => onClick(data.id)}
        />
      </div>
      <div className="flex flex-col items-start justify-between w-full pt-4 gap-y-1">
        <Link href={`/songs/${data.id}`} className="w-full">
          <p className="font-semibold truncate w-full hover:underline">
            {data.title}
          </p>
        </Link>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">
          {data.author}
        </p>
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center">
            <CiPlay1 size={12} />
            <div className="text-white ml-1 text-[12px]">{data.count}</div>
          </div>
          <div className="flex items-center ml-2">
            <CiHeart size={12} />
            <div className="text-white ml-1 text-[12px]">{data.like_count}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongItem;
