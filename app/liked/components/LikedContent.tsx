"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Song } from "@/types";
import { useUser } from "@/hooks/auth/useUser";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/player/useOnPlay";
import DeletePlaylistSongsBtn from "@/components/DeletePlaylistSongsBtn";
import { BsThreeDots } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LikedContentProps {
  songs: Song[];
  playlistId?: string;
}

const LikedContent: React.FC<LikedContentProps> = ({ songs, playlistId }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();
  const onPlay = useOnPlay(songs);

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
          <div className="flex-1 min-w-0">
            <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="text-neutral-400 cursor-pointer hover:text-white transition"
                aria-label="More Options"
              >
                <BsThreeDots size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="left"
              className="w-48 p-0 bg-neutral-800 border-neutral-700"
            >
              <div className="flex flex-col text-sm">
                <div className="px-4 py-3">
                  <LikeButton
                    songId={song.id}
                    songType={"regular"}
                    showText={true}
                  />
                </div>

                {playlistId && (
                  <div className="px-4 py-3">
                    <DeletePlaylistSongsBtn
                      songId={song.id}
                      playlistId={playlistId}
                      songType={"regular"}
                      showText={true}
                    />
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  );
};

export default LikedContent;
