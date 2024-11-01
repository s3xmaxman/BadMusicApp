"use client";

import DeleteButton from "@/components/DeleteButton";
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import MusicTabs from "@/components/MusicTabs";
import useOnPlay from "@/hooks/useOnPlay";
import useOnPlaySuno from "@/hooks/useOnPlaySuno";
import { useUser } from "@/hooks/useUser";
import { Song, SunoSong } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { useState } from "react";

interface SearchContentProps {
  songs: Song[];
  sunoSongs: SunoSong[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs, sunoSongs }) => {
  const onPlay = useOnPlay(songs);
  const onPlaySuno = useOnPlaySuno(sunoSongs);
  const { user } = useUser();
  const player = usePlayer();
  const [activeTab, setActiveTab] = useState<"songs" | "suno">("songs");

  const handlePlay = (id: string) => {
    if (activeTab === "suno") {
      onPlaySuno(id);
      player.setId(id, true);
    } else {
      onPlay(id);
      player.setId(id, false);
    }
  };

  const renderSongs = (
    songsData: Song[] | SunoSong[],
    isSuno: boolean = false
  ) => {
    if (songsData.length === 0) {
      return (
        <div className="flex flex-col gap-y-2 w-full text-neutral-400">
          <h1>
            {isSuno
              ? "AI生成された曲は見つかりませんでした"
              : "該当の曲が見つかりませんでした"}
          </h1>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-y-2 w-full">
        {songsData.map((song) => (
          <div key={song.id} className="flex items-center gap-x-4 w-full">
            <div className="flex-1 min-w-0">
              <MediaItem data={song} onClick={(id: string) => handlePlay(id)} />
            </div>
            {user?.id && (
              <div className="flex items-center gap-x-2">
                <LikeButton
                  songId={song.id}
                  songType={isSuno ? "suno" : "regular"}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full px-6">
      <MusicTabs
        onTabChange={setActiveTab}
        songsContent={renderSongs(songs)}
        sunoContent={renderSongs(sunoSongs, true)}
      />
    </div>
  );
};

export default SearchContent;
