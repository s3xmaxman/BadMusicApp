"use client";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import React, { useEffect, useState } from "react";
import PlayerContent from "./PlayerContent";
import MobileTabs from "./MobileTabs";
import { Playlist } from "@/types";

interface PlayerProps {
  playlists: Playlist[];
}

const Player = ({ playlists }: PlayerProps) => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song!);
  const [isMobilePlayer, setIsMobilePlayer] = useState(false);

  const toggleMobilePlayer = () => {
    setIsMobilePlayer(!isMobilePlayer);
  };

  if (!song || !songUrl || !player.activeId) {
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
          <PlayerContent
            song={song}
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
