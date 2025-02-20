"use client";
import useGetSongById from "@/hooks/data/useGetSongById";
import useLoadSongUrl from "@/hooks/data/useLoadSongUrl";
import usePlayer from "@/hooks/player/usePlayer";
import React from "react";
import PlayerContent from "./PlayerContent";
import MobileTabs from "./Mobile/MobileTabs";
import { Playlist, Song } from "@/types";
import useMobilePlayer from "@/hooks/player/useMobilePlayer";

interface PlayerProps {
  playlists: Playlist[];
}

const Player = ({ playlists }: PlayerProps) => {
  const player = usePlayer();
  const { isMobilePlayer, toggleMobilePlayer } = useMobilePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song);

  if (!songUrl) {
    return (
      <>
        {!isMobilePlayer && (
          <div className="md:hidden ">
            <MobileTabs />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full ">
        <div className="bg-black w-full h-[100px] pb-[130px] md:pb-0 max-md:px-2">
          <PlayerContent
            song={song!}
            songUrl={songUrl}
            isMobilePlayer={isMobilePlayer}
            toggleMobilePlayer={toggleMobilePlayer}
            playlists={playlists}
          />
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
