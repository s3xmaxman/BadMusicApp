"use client";

import DeleteButton from "@/components/DeleteButton";
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/player/useOnPlay";
import { useUser } from "@/hooks/auth/useUser";
import { Song } from "@/types";
import usePlayer from "@/hooks/player/usePlayer";
import SongOptionsPopover from "@/components/SongOptionsPopover";
import SongList from "@/components/SongList";

interface SearchContentProps {
  songs: Song[];
  playlistId?: string;
}

const SearchContent: React.FC<SearchContentProps> = ({ songs, playlistId }) => {
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
      <div className="flex flex-col gap-y-2 w-full p-6">
        {songsData.map((song) => (
          <div key={song.id} className="flex items-center gap-x-4 w-full">
            <div className="flex-1 min-w-0">
              <SongList data={song} onClick={(id: string) => handlePlay(id)} />
            </div>
            {user?.id && (
              <SongOptionsPopover song={song} playlistId={playlistId} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return <div className="w-full px-6">{renderSongs(songs)}</div>;
};

export default SearchContent;
