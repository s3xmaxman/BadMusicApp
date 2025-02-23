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

  // Array of vibrant colors for random selection
  const colors = [
    "from-purple-500/20 to-purple-700/20",
    "from-blue-500/20 to-blue-700/20",
    "from-green-500/20 to-green-700/20",
    "from-red-500/20 to-red-700/20",
    "from-pink-500/20 to-pink-700/20",
    "from-indigo-500/20 to-indigo-700/20",
    "from-cyan-500/20 to-cyan-700/20",
  ];

  if (playlists.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        <h1>Playlistが見つかりませんでした</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6 ">
      {playlists.map((playlist, index) => {
        return (
          <div
            key={playlist.id}
            className="group relative cursor-pointer w-full max-w-[200px]"
            onClick={() =>
              router.push(
                `/playlists/${playlist.id}?title=${encodeURIComponent(
                  playlist.title
                )}`
              )
            }
          >
            {/* Background stacked cards effect */}
            <div className="absolute top-2 left-2 w-full h-full bg-[#4c1d95]  transform rotate-3 rounded-xl" />
            <div className="absolute top-1 left-1 w-full h-full bg-[#4c1d95] transform rotate-2 rounded-xl" />

            {/* Main card */}
            <div className="rounded-xl relative bg-neutral-900 p-3 transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
              <div className="relative aspect-square w-full overflow-hidden rounded-md mb-3">
                <Image
                  fill
                  src={imageUrl[index] || "/images/playlist.png"}
                  alt="PlaylistItem"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-900/90 rounded-xl" />

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-white truncate">
                  {playlist.title}
                </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistContent;
