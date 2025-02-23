"use client";

import { Song } from "@/types";
import { BsThreeDots } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LikeButton from "@/components/LikeButton";
import DeletePlaylistSongsBtn from "@/components/DeletePlaylistSongsBtn";

interface SongOptionsPopoverProps {
  song: Song;
  playlistId?: string;
}

const SongOptionsPopover: React.FC<SongOptionsPopoverProps> = ({
  song,
  playlistId,
}) => {
  return (
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
            <LikeButton songId={song.id} songType={"regular"} showText={true} />
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
  );
};

export default SongOptionsPopover;
