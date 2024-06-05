import MediaItem from "@/components/MediaItem";
import { Playlist } from "@/types";
import React from "react";

interface PlaylistContentProps {
  playlists: Playlist[];
}

const PlaylistContent = ({ playlists }: PlaylistContentProps) => {
  if (playlists.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        <h1>Playlistが見つかりませんでした</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1 min-w-0">
            <MediaItem data={playlist} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistContent;
