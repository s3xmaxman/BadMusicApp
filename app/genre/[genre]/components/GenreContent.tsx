"use client";
import DeleteButton from "@/components/DeleteButton";
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/player/useOnPlay";
import { useUser } from "@/hooks/auth/useUser";
import { Song } from "@/types";
import React from "react";
import SongList from "@/components/SongList";
import SongOptionsPopover from "@/components/SongOptionsPopover";

interface Props {
  songs: Song[];
}

const GenreContent = ({ songs }: Props) => {
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
    <div className="flex flex-col gap-y-2 w-full p-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1 min-w-0">
            <SongList data={song} onClick={(id: string) => onPlay(id)} />
          </div>
          {user?.id && (
            <div className="flex items-center gap-x-2">
              <SongOptionsPopover song={song} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GenreContent;
