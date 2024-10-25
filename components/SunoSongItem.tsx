import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { SunoSong } from "@/types";
import { CiMusicNote1 } from "react-icons/ci";

interface SunoSongItemProps {
  onClick: (id: string) => void;
  data: SunoSong;
}

const SunoSongItem: React.FC<SunoSongItemProps> = ({ onClick, data }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3">
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}
        <Image
          className={`object-cover w-full h-full transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={data.image_url || "/images/wait.jpg"}
          fill
          alt={data.title}
          onLoad={() => setIsImageLoaded(true)}
          onClick={() => onClick(data.song_id || "")}
        />
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
          {data.model_name}
        </div>
      </div>

      <div className="flex flex-col items-start justify-between w-full pt-4 gap-y-1">
        <Link href={`/suno-songs/${data.song_id}`} className="w-full">
          <p className="font-semibold truncate w-full hover:underline">
            {data.title || "Untitled"}
          </p>
        </Link>

        <div className="text-neutral-400 text-sm w-full truncate">
          {data.prompt}
        </div>

        <div className="flex items-center justify-between w-full mt-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <CiMusicNote1 className="mr-1" />
              {data.type || "Generated"}
            </div>
            {data.tags && (
              <div className="flex items-center">
                <CiMusicNote1 className="mr-1" />
                {data.tags.split(",")[0]}
              </div>
            )}
          </div>
          <div>{formatDate(data.created_at)}</div>
        </div>

        {data.status && data.status !== "completed" && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
            {data.status}
          </div>
        )}
      </div>
    </div>
  );
};

export default SunoSongItem;
