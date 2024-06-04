"use client";
import GenreSelect from "@/components/GenreSelect";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import { useState } from "react";

interface PageContentProps {
  songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({ songs }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const onPlay = useOnPlay(songs);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const filteredSongs =
    selectedGenre === "All"
      ? songs
      : songs.filter((song) => song.genre === selectedGenre);

  if (!songs) {
    return (
      <div className="mt-4 text-neutral-400">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <GenreSelect onGenreChange={handleGenreChange} />
      </div>
      <div className="flex-grow">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-3">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((item) => (
              <SongItem
                onClick={(id) => onPlay(id)}
                key={item.id}
                data={item}
              />
            ))
          ) : (
            <p className="col-span-full text-neutral-400">
              該当する曲がありません
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageContent;
