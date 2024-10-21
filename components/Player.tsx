"use client";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import React, { useState, useContext, useEffect } from "react";
import PlayerContent from "./PlayerContent";
import MobileTabs from "./Mobile/MobileTabs";
import { Playlist } from "@/types";
import SoundCloudPlayerContent from "./SoundCloudPlayerContent";
import { useSoundCloudPlayerStore } from "@/hooks/useSoundCloudPlayerStore";

// TODO: SoundCloudPlayerContentとPlayerContentのシームレスな切り替えを行えるようにする

interface PlayerProps {
  playlists: Playlist[];
}

const Player = ({ playlists }: PlayerProps) => {
  const player = usePlayer();
  const { currentUrl } = useSoundCloudPlayerStore();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song!);
  const [isSoundCloudPlaying, setIsSoundCloudPlaying] = useState(false);
  const [isMobilePlayer, setIsMobilePlayer] = useState(false);

  const toggleMobilePlayer = () => {
    setIsMobilePlayer(!isMobilePlayer);
  };

  useEffect(() => {
    if (currentUrl) {
      setIsSoundCloudPlaying(true);
    } else {
      setIsSoundCloudPlaying(false);
    }
  }, [currentUrl]);

  if (!songUrl && !currentUrl) {
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
          {currentUrl ? (
            <SoundCloudPlayerContent />
          ) : (
            <PlayerContent
              song={song!}
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
