"use client";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import React, { useState, useEffect } from "react";
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

  // 常に両方のフックを呼び出し
  const { song, isLoading } = useGetSongById(player.activeId);
  const { song: sunoSong, isLoading: isLoadingSuno } = useGetSunoSongById(
    player.activeId
  );

  const songUrl = useLoadSongUrl(song!);

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
          {player.isSuno && sunoSong ? (
            <SunoPlayerContent
              song={sunoSong as SunoSong}
              isMobilePlayer={isMobilePlayer}
              toggleMobilePlayer={toggleMobilePlayer}
              playlists={playlists}
            />
          ) : (
            <PlayerContent
              song={song as Song}
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
