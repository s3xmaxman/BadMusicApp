"use client";

import Image from "next/image";

import useLoadImage from "@/hooks/useLoadImage";
import { Playlist, Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { useRouter } from "next/navigation";

interface MediaItemProps {
  data: Song | Playlist;
  onClick?: (id: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const player = usePlayer();
  const imageUrl = useLoadImage(data);
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    } else if ("author" in data && data.id) {
      player.setId(data.id);
    } else if (data.id) {
      router.push(`/playlist/${data.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 p-2 rounded-md"
    >
      <div className="relative rounded-md overflow-hidden min-h-[48px] min-w-[48px]">
        <Image
          fill
          src={imageUrl || "/images/playlist.png"}
          alt="MediaItem"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden w-[70%]">
        <p className="text-white truncate w-full">{data.title}</p>
        {"author" in data && (
          <p className="text-neutral-400 text-sm truncate">{data.author}</p>
        )}
      </div>
    </div>
  );
};

export default MediaItem;
