"use client";

import React from "react";
import usePlayer from "@/hooks/player/usePlayer";
import useGetSongById from "@/hooks/data/useGetSongById";
import FullScreenLayout from "./FullScreenLayout";
import { twMerge } from "tailwind-merge";
import useLoadMedia from "@/hooks/data/useLoadMedia";

interface RightSidebarProps {
  children: React.ReactNode;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ children }) => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const { song: nextSong } = useGetSongById(player.getNextSongId());

  const currentSong = song;
  const nextTrack = nextSong;

  const videoPath = useLoadMedia(currentSong!, {
    type: "video",
    bucket: "videos",
  });
  const imagePath = useLoadMedia(currentSong!, {
    type: "image",
    bucket: "images",
  });
  const nextImagePath = useLoadMedia(nextTrack!, {
    type: "image",
    bucket: "images",
  });

  const showRightSidebar = currentSong && nextTrack;

  return (
    <div className={twMerge(`flex h-full`, player.activeId && "h-full")}>
      <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
      {showRightSidebar && (
        <div className="hidden xl:flex w-96 h-full bg-black p-2">
          <FullScreenLayout
            song={currentSong!}
            videoPath={videoPath?.[0]!}
            imagePath={imagePath?.[0]!}
            nextSong={nextTrack}
            nextImagePath={nextImagePath?.[0]!}
          />
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
