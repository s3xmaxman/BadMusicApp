import React, { memo } from "react";
import { LiaMicrophoneAltSolid } from "react-icons/lia";
import { RiPlayListAddFill } from "react-icons/ri";
import { Playlist } from "@/types";
import AddPlaylist from "../AddPlaylist";
import LikeButton from "../LikeButton";

interface MobileStyleIconsProps {
  toggleLyrics: () => void;
  playlists: Playlist[];
  songId: string;
  songType: "regular" | "suno";
}

const MobileStyleIcons: React.FC<MobileStyleIconsProps> = memo(
  ({ toggleLyrics, playlists, songId, songType }) => (
    <div className="flex flex-col items-center space-y-6">
      <button
        onClick={toggleLyrics}
        className="flex flex-col items-center text-white"
      >
        <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <LiaMicrophoneAltSolid size={24} />
        </div>
        <span className="text-xs mt-1">Lyrics</span>
      </button>

      <div className="flex flex-col items-center text-white">
        <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <AddPlaylist
            playlists={playlists}
            songId={songId}
            songType={songType}
          >
            <RiPlayListAddFill size={24} />
          </AddPlaylist>
        </div>
        <span className="text-xs mt-1">Playlist</span>
      </div>

      <div className="flex flex-col items-center text-white">
        <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <LikeButton songId={songId} size={24} songType={songType} />
        </div>
        <span className="text-xs mt-1">Like</span>
      </div>
    </div>
  )
);

MobileStyleIcons.displayName = "MobileStyleIcons";

export default MobileStyleIcons;
