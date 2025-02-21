"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Playlist } from "@/types";
import useLoadMedia from "@/hooks/data/useLoadMedia";

interface PlaylistContentProps {
  playlists: Playlist[];
}

const PlaylistContent = ({ playlists }: PlaylistContentProps) => {
  const imageUrl = useLoadMedia(playlists, { type: "image", bucket: "images" });
  const router = useRouter();

  if (playlists.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        <h1>Playlistが見つかりませんでした</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {playlists.map((playlist, index) => {
        return (
          <div
            key={playlist.id}
            className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 p-2 rounded-md"
            onClick={() =>
              router.push(
                `/playlists/${playlist.id}?title=${encodeURIComponent(
                  playlist.title
                )}`
              )
            }
          >
            <div className="relative rounded-md overflow-hidden min-h-[48px] min-w-[48px]">
              <Image
                fill
                src={imageUrl[index] || "/images/playlist.png"}
                alt="PlaylistItem"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-y-1 overflow-hidden w-[70%]">
              <p className="text-white truncate w-full">{playlist.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistContent;
