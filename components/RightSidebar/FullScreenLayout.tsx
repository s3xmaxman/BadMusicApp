import React from "react";
import { Song } from "@/types";
import NextSongPreview from "./NextSongPreview";
import CurrentSongDisplay from "./CurrentSongDisplay";

interface FullScreenLayoutProps {
  song: Song;
  videoPath?: string;
  imagePath?: string;
  nextSong: Song;
  nextImagePath?: string;
  toggleLayout: () => void;
}

const FullScreenLayout: React.FC<FullScreenLayoutProps> = React.memo(
  ({ song, videoPath, imagePath, nextSong, nextImagePath, toggleLayout }) => {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <CurrentSongDisplay
          song={song}
          videoPath={videoPath}
          imagePath={imagePath}
          toggleLayout={toggleLayout}
        />
        <NextSongPreview nextSong={nextSong} nextImagePath={nextImagePath} />
      </div>
    );
  }
);

FullScreenLayout.displayName = "FullScreenLayout"; // displayName を追加

export default FullScreenLayout;
