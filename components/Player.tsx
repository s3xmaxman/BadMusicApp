"use client";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import React, { useState, useContext, useEffect } from "react";
import PlayerContent from "./PlayerContent";
import MobileTabs from "./Mobile/MobileTabs";
import { Playlist } from "@/types";
import SoundCloudPlayerContent from "./SoundCloudPlayerContent";
import { SoundCloudContext } from "@/providers/SoundCloudProvider";

interface PlayerProps {
  playlists: Playlist[];
}

const Player = ({ playlists }: PlayerProps) => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song!);
  const [isMobilePlayer, setIsMobilePlayer] = useState(false);
  const { currentUrl } = useContext(SoundCloudContext);
  const [isSoundCloudPlaying, setIsSoundCloudPlaying] = useState(false);

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
            <SoundCloudPlayerContent url={currentUrl} />
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
