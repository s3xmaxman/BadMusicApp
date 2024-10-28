"use client";

import React, { useEffect, useState, useCallback } from "react";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadVideo from "@/hooks/useLoadVideo";
import FullScreenLayout from "./FullScreenLayout";
import StandardLayout from "./StandardLayout";
import useGetSunoSongById from "@/hooks/useGetSunoSongById";

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
    if (song && song.video_path) {
      setIsFullScreenLayout(true);
    } else {
      setIsFullScreenLayout(false);
    }
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
