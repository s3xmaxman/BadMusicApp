"use client";

import Image from "next/image";
import { Playlist, Song } from "@/types";
import usePlayer from "@/hooks/player/usePlayer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useLoadMedia from "@/hooks/data/useLoadMedia";
import { twMerge } from "tailwind-merge";

interface MediaItemProps {
  data: Song | Playlist;
  onClick?: (id: string) => void;
  isCollapsed?: boolean;
  className?: string;
}

const MediaItem: React.FC<MediaItemProps> = ({
  data,
  onClick,
  isCollapsed,
  className,
}) => {
  const player = usePlayer();
  const router = useRouter();
  const imageUrl = useLoadMedia(data, { type: "image", bucket: "images" });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id!);
    }

    if ("author" in data && data.id) {
      return player.setId(data.id);
    }

    if (data.id) {
      return router.push(
        `/playlists/${data.id}?title=${encodeURIComponent(data.title)}`
      );
    }
  };

  return (
    <div
      onClick={handleClick}
      className={twMerge(
        `
        flex
        items-center
        gap-x-3
        cursor-pointer
        rounded-xl
        p-2
        group
        relative
        animate-fade-in
        `,
        className
      )}
    >
      <div
        className={twMerge(
          `
          relative
          rounded-lg
          overflow-hidden
          min-h-[48px]
          min-w-[48px]
          transition-transform
          duration-300
          shadow-md
          `
        )}
      >
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
        )}
        <Image
          fill
          src={imageUrl?.[0] || "/images/playlist.png"}
          alt="MediaItem"
          className={`object-cover transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col gap-y-1 overflow-hidden w-[70%]">
          <p className="text-white truncate w-full text-gradient font-medium">
            {data.title || "Untitled"}
          </p>
          {"author" in data && (
            <p className="text-neutral-400 text-sm truncate group-hover:text-neutral-300 transition-colors">
              {data.author}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaItem;
