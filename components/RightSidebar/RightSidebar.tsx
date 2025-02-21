"use client";

import React from "react";
import useLoadImage from "@/hooks/data/useLoadImage";
import usePlayer from "@/hooks/player/usePlayer";
import useGetSongById from "@/hooks/data/useGetSongById";
import useLoadVideo from "@/hooks/data/useLoadVideo";
import FullScreenLayout from "./FullScreenLayout";
import { twMerge } from "tailwind-merge";

interface RightSidebarProps {
  children: React.ReactNode;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ children }) => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const { song: nextSong } = useGetSongById(player.getNextSongId());

  const currentSong = song;
  const nextTrack = nextSong;

  const videoPath = useLoadVideo(currentSong!);
  const imagePath = useLoadImage(currentSong!);
  const nextImagePath = useLoadImage(nextTrack!);

  const showRightSidebar = currentSong && nextTrack;

  return (
    <div className={twMerge(`flex h-full`, player.activeId && "h-full")}>
      <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
      {showRightSidebar && (
        <div className="hidden xl:flex w-96 h-full bg-black p-2">
          <FullScreenLayout
            song={currentSong!}
            videoPath={videoPath!}
            imagePath={imagePath!}
            nextSong={nextTrack}
            nextImagePath={nextImagePath!}
          />
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
