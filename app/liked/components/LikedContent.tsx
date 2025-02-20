"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Song, SunoSong } from "@/types";
import { useUser } from "@/hooks/auth/useUser";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/player/useOnPlay";
import DeletePlaylistSongsBtn from "@/components/DeletePlaylistSongsBtn";
import useOnPlaySuno from "@/hooks/player/useOnPlaySuno";

interface LikedContentProps {
  songs: Song[];
  playlistId?: string;
}

const LikedContent: React.FC<LikedContentProps> = ({ songs, playlistId }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();
  const onPlayRegular = useOnPlay(songs.filter((song) => !("song_id" in song)));
  const onPlaySuno = useOnPlaySuno(
    songs.filter(
      (song) =>
        "song_id" in song &&
        "image_url" in song &&
        "audio_url" in song &&
        "model_name" in song &&
        "prompt" in song
    ) as SunoSong[]
  );

  const displayedSongs = playlistId ? [...songs].reverse() : songs;

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (songs.length === 0) {
    return (
      <div className=" flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        楽曲が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full p-6">
      {displayedSongs.map((song: Song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem
              onClick={(id: string) =>
                "song_id" in song ? onPlaySuno(id) : onPlayRegular(id)
              }
              data={song}
            />
          </div>
          <LikeButton
            songId={song.id}
            songType={"song_id" in song ? "suno" : "regular"}
          />
          {playlistId && (
            <DeletePlaylistSongsBtn
              songId={song.id}
              playlistId={playlistId}
              songType={"song_id" in song ? "suno" : "regular"}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default LikedContent;
