"use client";

import SongItem from "@/components/SongItem";
import SunoSongItem from "@/components/Suno/SunoSongItem";
import useOnPlay from "@/hooks/player/useOnPlay";
import { Song, SunoSong } from "@/types";
import useOnPlaySuno from "@/hooks/player/useOnPlaySuno";
import { useState } from "react";
import usePlayer from "@/hooks/player/usePlayer";
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
  const [visibleSongCount, setVisibleSongCount] = useState(6);
  const [visibleSunoSongCount, setVisibleSunoSongCount] = useState(6);

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

  const handleViewAllSongs = () => {
    setVisibleSongCount(songs.length);
  };

  const handleViewAllSunoSongs = () => {
    setVisibleSunoSongCount(sunoSongs.length);
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
              <div className="flex flex-col">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {songs.slice(0, visibleSongCount).map((item) => (
                    <SongItem
                      onClick={(id) => handlePlay(id)}
                      key={item.id}
                      data={item}
                    />
                  ))}
                </div>
                {visibleSongCount < songs.length && (
                  <button
                    onClick={handleViewAllSongs}
                    className="mt-4 text-sm text-neutral-400 hover:text-white"
                  >
                    View All
                  </button>
                )}
              </div>
            }
            sunoContent={
              <div className="flex flex-col">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {sunoSongs.slice(0, visibleSunoSongCount).map((item) => (
                    <SunoSongItem
                      onClick={(id) => handlePlay(id)}
                      key={item.id}
                      data={item}
                    />
                  ))}
                </div>
                {visibleSunoSongCount < sunoSongs.length && (
                  <button
                    onClick={handleViewAllSunoSongs}
                    className="mt-4 text-sm text-neutral-400 hover:text-white"
                  >
                    View All
                  </button>
                )}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PageContent;
