import React from "react";
import { Song, SunoSong } from "@/types";
import NextSongPreview from "./NextSongPreview";
import CurrentSongDisplay from "./CurrentSongDisplay";

interface FullScreenLayoutProps {
  song: Song | SunoSong;
  videoPath?: string;
  imagePath?: string;
  nextSong: Song | SunoSong;
  nextImagePath?: string;
  toggleLayout: () => void;
}

const FullScreenLayout: React.FC<FullScreenLayoutProps> = React.memo(
  ({ song, videoPath, imagePath, nextSong, nextImagePath, toggleLayout }) => {
    return (
      <div className="relative w-full h-full overflow-hidden rounded-xl">
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

FullScreenLayout.displayName = "FullScreenLayout";

export default FullScreenLayout;
