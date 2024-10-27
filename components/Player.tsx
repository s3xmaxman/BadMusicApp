"use client";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import React, { useState, useEffect } from "react";
import PlayerContent from "./PlayerContent";
import MobileTabs from "./Mobile/MobileTabs";
import { Playlist, Song, SunoSong } from "@/types";
import SunoPlayerContent from "./SunoPlayerContnet";

interface PlayerProps {
  playlists: Playlist[];
}

const Player = ({ playlists }: PlayerProps) => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId, player.isSuno);
  const songUrl = useLoadSongUrl(song!);
  const [isMobilePlayer, setIsMobilePlayer] = useState(false);

  console.log(song);
  const isSunoSong = (song: Song | SunoSong): song is SunoSong => {
    return "song_id" in song;
  };

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

  const renderPlayer = () => {
    if (song) {
      if (player.isSuno && song && isSunoSong(song)) {
        return (
          <SunoPlayerContent
            song={song}
            isMobilePlayer={isMobilePlayer}
            toggleMobilePlayer={toggleMobilePlayer}
            playlists={playlists}
          />
        );
      }
      return (
        <PlayerContent
          song={song}
          songUrl={songUrl}
          isMobilePlayer={isMobilePlayer}
          toggleMobilePlayer={toggleMobilePlayer}
          playlists={playlists}
        />
      );
    }
    return null;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full ">
        <div className="bg-black w-full py-2 px-4 h-[100px] pb-[130px] md:pb-0">
          {renderPlayer()}
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
