"use client";

import DeleteButton from "@/components/DeleteButton";
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);
  const { user } = useUser();

  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        <h1>該当の曲が見つかりませんでした</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1 min-w-0">
            <MediaItem data={song} onClick={(id: string) => onPlay(id)} />
          </div>
          {user?.id && (
            <div className="flex items-center gap-x-2">
              <LikeButton songId={song.id} />
              <DeleteButton
                songId={song.id}
                songPath={song.song_path}
                imagePath={song.image_path}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchContent;
