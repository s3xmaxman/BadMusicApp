import React, { useState } from "react";
import { Song, SunoSong } from "@/types";
import NextSongPreview from "./NextSongPreview";
import CurrentSongDisplay from "./CurrentSongDisplay";
import { IoMdSwap } from "react-icons/io";
import { MdLyrics } from "react-icons/md";

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
    const [showLyrics, setShowLyrics] = useState(false);
    const isSunoSong = "audio_url" in song;
    const lyrics = isSunoSong
      ? song.lyric ?? "歌詞はありません"
      : song.lyrics ?? "歌詞はありません";

    if (showLyrics) {
      return (
        <div className="relative w-full h-full bg-black">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setShowLyrics(false)}
              className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
            >
              <IoMdSwap className="text-white" size={24} />
            </button>
          </div>
          <div className="flex items-center justify-center h-full p-6">
            <div className="w-full max-h-full overflow-auto">
              <p
                className="whitespace-pre-wrap text-white text-xl font-medium text-center"
                style={{ textShadow: "0 0 10px #fff" }}
              >
                {lyrics}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full overflow-hidden rounded-xl">
        <CurrentSongDisplay
          song={song}
          videoPath={videoPath}
          imagePath={imagePath}
          toggleLayout={toggleLayout}
        />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col">
          <NextSongPreview nextSong={nextSong} nextImagePath={nextImagePath} />
        </div>
        {/* 歌詞表示への切替ボタン */}
        <div className="absolute top-4 right-16">
          <button
            onClick={() => setShowLyrics(true)}
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200 flex items-center"
          >
            <MdLyrics className="text-white" size={24} />
          </button>
        </div>
        {/* 既存のレイアウト切替ボタン */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleLayout}
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
          >
            <IoMdSwap className="text-white" size={24} />
          </button>
        </div>
      </div>
    );
  }
);

FullScreenLayout.displayName = "FullScreenLayout";

export default FullScreenLayout;
