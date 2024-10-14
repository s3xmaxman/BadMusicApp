// RightSidebar.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadVideo from "@/hooks/useLoadVideo";
import FullScreenLayout from "./FullScreenLayout";
import StandardLayout from "./StandardLayout";

const RightSidebar = () => {
  const [isFullScreenLayout, setIsFullScreenLayout] = useState(false);
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const { song: nextSong } = useGetSongById(player.getNextSongId());
  const videoPath = useLoadVideo(song!);
  const imagePath = useLoadImage(song!);
  const nextImagePath = useLoadImage(nextSong!);

  useEffect(() => {
    if (song && song.video_path) {
      setIsFullScreenLayout(true);
    } else {
      setIsFullScreenLayout(false);
    }
  }, [song]);

  const toggleLayout = useCallback(() => {
    setIsFullScreenLayout((prev) => !prev);
  }, []);

  if (!song || !nextSong) {
    return null;
  }

  return isFullScreenLayout ? (
    <FullScreenLayout
      song={song}
      videoPath={videoPath!}
      imagePath={imagePath!}
      nextSong={nextSong}
      nextImagePath={nextImagePath!}
      toggleLayout={toggleLayout}
    />
  ) : (
    <StandardLayout
      song={song}
      imagePath={imagePath!}
      nextSong={nextSong}
      nextImagePath={nextImagePath!}
      toggleLayout={toggleLayout}
    />
  );
};

export default RightSidebar;
