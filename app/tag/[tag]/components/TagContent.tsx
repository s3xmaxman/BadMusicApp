"use client";
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlaySuno from "@/hooks/player/useOnPlaySuno";
import { SunoSong } from "@/types";
import { useUser } from "@/hooks/auth/useUser";
import React from "react";

interface Props {
  sunoSongs: SunoSong[];
}

const TagContent = ({ sunoSongs }: Props) => {
  const onPlay = useOnPlaySuno(sunoSongs);
  const { user } = useUser();

  if (sunoSongs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        <h1>該当の曲が見つかりませんでした</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {sunoSongs.map((sunoSong) => (
        <div key={sunoSong.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1 min-w-0">
            <MediaItem data={sunoSong} onClick={(id: string) => onPlay(id)} />
          </div>
          {user?.id && (
            <div className="flex items-center gap-x-2">
              <LikeButton songId={sunoSong.id} songType="suno" />
              {/* <DeleteButton
                songId={sunoSong.id}
                songPath={sunoSong.song_path}
                imagePath={sunoSong.image_url}
              /> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TagContent;
