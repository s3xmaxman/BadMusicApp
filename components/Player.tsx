"use client";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import React, { useState } from "react";
import PlayerContent from "./PlayerContent";
import MobileTabs from "./Mobile/MobileTabs";
import { Playlist, Song, SunoSong } from "@/types";
import SunoPlayerContent from "./SunoPlayerContnet";
import useGetSunoSongById from "@/hooks/useGetSunoSongById";

interface PlayerProps {
  playlists: Playlist[];
}

const Player = ({ playlists }: PlayerProps) => {
  const player = usePlayer();
  const [isMobilePlayer, setIsMobilePlayer] = useState(false);

  const { song } = useGetSongById(player.activeId);
  const { sunoSong } = useGetSunoSongById(player.activeId);

  const actualSong = player.isSuno ? undefined : song;
  const actualSunoSong = player.isSuno ? sunoSong : undefined;

  const songUrl = useLoadSongUrl(player.isSuno ? actualSunoSong : actualSong);

  const toggleMobilePlayer = () => {
    setIsMobilePlayer(!isMobilePlayer);
  };

  if (!songUrl) {
    return (
      <>
        {!isMobilePlayer && (
          <div className="md:hidden">
            <MobileTabs />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full ">
        <div className="bg-black w-full py-2 px-4 h-[100px] pb-[130px] md:pb-0">
          {player.isSuno ? (
            <SunoPlayerContent
              song={actualSunoSong as SunoSong}
              songUrl={songUrl}
              isMobilePlayer={isMobilePlayer}
              toggleMobilePlayer={toggleMobilePlayer}
              playlists={playlists}
            />
          ) : (
            <PlayerContent
              song={actualSong as Song}
              songUrl={songUrl}
              isMobilePlayer={isMobilePlayer}
              toggleMobilePlayer={toggleMobilePlayer}
              playlists={playlists}
            />
          )}
        </div>
      </div>
      {!isMobilePlayer && (
        <div className="md:hidden">
          <MobileTabs />
        </div>
      )}
    </>
  );
};

export default Player;
