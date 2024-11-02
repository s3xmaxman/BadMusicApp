"use client";

import SongItem from "@/components/SongItem";
import SunoSongItem from "@/components/Suno/SunoSongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song, SunoSong } from "@/types";
import useOnPlaySuno from "@/hooks/useOnPlaySuno";
import { useState } from "react";
import usePlayer from "@/hooks/usePlayer";
import MusicTabs from "@/components/MusicTabs";

interface PageContentProps {
  songs: Song[];
  sunoSongs: SunoSong[];
}

const PageContent: React.FC<PageContentProps> = ({ songs, sunoSongs }) => {
  const player = usePlayer();
  const onPlay = useOnPlay(songs);
  const onPlaySuno = useOnPlaySuno(sunoSongs);
  const [activeTab, setActiveTab] = useState<"songs" | "suno">("songs");

  if (!songs || !sunoSongs) {
    return (
      <div className="mt-4 text-neutral-400">
        <h1>Loading...</h1>
      </div>
    );
  }

  const handlePlay = (id: string) => {
    if (activeTab === "suno") {
      onPlaySuno(id);
      player.setId(id, true);
    } else {
      onPlay(id);
      player.setId(id, false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Latest Songs
              </h2>
              <p className="text-sm text-neutral-400">
                Discover your new favorite tracks
              </p>
            </div>
          </div>

          <MusicTabs
            onTabChange={setActiveTab}
            songsContent={
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {songs.map((item) => (
                  <SongItem
                    onClick={(id) => handlePlay(id)}
                    key={item.id}
                    data={item}
                  />
                ))}
              </div>
            }
            sunoContent={
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {sunoSongs.map((item) => (
                  <SunoSongItem
                    onClick={(id) => handlePlay(id)}
                    key={item.id}
                    data={item}
                  />
                ))}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PageContent;
