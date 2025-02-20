"use client";

import DeleteButton from "@/components/DeleteButton";
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/player/useOnPlay";
import { useUser } from "@/hooks/auth/useUser";
import { Song } from "@/types";
import usePlayer from "@/hooks/player/usePlayer";

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);
  const { user } = useUser();
  const player = usePlayer();

  const handlePlay = (id: string) => {
    onPlay(id);
    player.setId(id);
  };

  const renderSongs = (songsData: Song[]) => {
    if (songsData.length === 0) {
      return (
        <div className="flex flex-col gap-y-2 w-full text-neutral-400">
          <h1>該当の曲が見つかりませんでした</h1>
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
                <LikeButton songId={song.id} songType={"regular"} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return <div className="w-full px-6">{renderSongs(songs)}</div>;
};

export default SearchContent;
