"use client";

import React, { useEffect, useState, useCallback } from "react";
import useLoadImage from "@/hooks/data/useLoadImage";
import usePlayer from "@/hooks/player/usePlayer";
import useGetSongById from "@/hooks/data/useGetSongById";
import useLoadVideo from "@/hooks/data/useLoadVideo";
import FullScreenLayout from "./FullScreenLayout";
import StandardLayout from "./StandardLayout";
import useGetSunoSongById from "@/hooks/data/useGetSunoSongById";

const RightSidebar = () => {
  const [isFullScreenLayout, setIsFullScreenLayout] = useState(false);
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const { sunoSong } = useGetSunoSongById(player.activeId);
  const { song: nextSong } = useGetSongById(player.getNextSongId());
  const { sunoSong: nextSunoSong } = useGetSunoSongById(player.getNextSongId());

  const currentSong = player.isSuno ? sunoSong : song;
  const nextTrack = player.isSuno ? nextSunoSong : nextSong;

  const videoPath = useLoadVideo(currentSong!);
  const imagePath = useLoadImage(currentSong!);
  const nextImagePath = useLoadImage(nextTrack!);

  useEffect(() => {
    setIsFullScreenLayout(!!(song?.video_path && !player.isSuno));
  }, [song, sunoSong]);

  const toggleLayout = useCallback(() => {
    setIsFullScreenLayout((prev) => !prev);
  }, []);

  if (!currentSong || !nextTrack) {
    return null;
  }

  return isFullScreenLayout ? (
    <FullScreenLayout
      song={currentSong!}
      videoPath={videoPath!}
      imagePath={imagePath!}
      nextSong={nextTrack}
      nextImagePath={nextImagePath!}
      toggleLayout={toggleLayout}
    />
  ) : (
    <StandardLayout
      song={currentSong!}
      imagePath={imagePath!}
      nextSong={nextTrack}
      nextImagePath={nextImagePath!}
      toggleLayout={toggleLayout}
    />
  );
};

export default RightSidebar;
