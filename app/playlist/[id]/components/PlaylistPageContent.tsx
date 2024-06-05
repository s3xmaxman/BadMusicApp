"use client";

import Image from "next/image";
import Header from "@/components/Header";
import LikedContent from "@/app/liked/components/LikedContent";
import { Song } from "@/types";

interface PlaylistPageContentProps {
  playlistId: string;
  playlistTitle: string;
  songs: Song[]; // Song型は適宜定義してください
}

const PlaylistPageContent: React.FC<PlaylistPageContentProps> = ({
  playlistId,
  playlistTitle,
  songs,
}) => {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                fill
                src="/images/playlist.png"
                alt="Playlist"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm"></p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                {playlistTitle}
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <div>
        {songs.length ? (
          <LikedContent songs={songs} />
        ) : (
          <p className="text-white">No songs</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistPageContent;
