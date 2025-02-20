"use client";

import React from "react";
import useLoadImage from "@/hooks/data/useLoadImage";
import usePlayer from "@/hooks/player/usePlayer";
import useGetSongById from "@/hooks/data/useGetSongById";
import useLoadVideo from "@/hooks/data/useLoadVideo";
import FullScreenLayout from "./FullScreenLayout";
import useGetSunoSongById from "@/hooks/data/useGetSunoSongById";

const RightSidebar = () => {
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

  if (!currentSong || !nextTrack) {
    return null;
  }

  return (
    <FullScreenLayout
      song={currentSong!}
      videoPath={videoPath!}
      imagePath={imagePath!}
      nextSong={nextTrack}
      nextImagePath={nextImagePath!}
    />
  );
};

export default RightSidebar;
