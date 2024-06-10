"use client";

import { cn } from "@/libs/utils";
import React, { useState } from "react";

interface GenreSelectProps {
  onGenreChange: (genres: string[]) => void;
  className?: string;
  defaultValue?: string[];
}

const genres = [
  "Nu Disco",
  "Future Funk",
  "Vapor Wave",
  "Synth Wave",
  "Electro",
  "Electro House",
  "Tropical House",
  "Deep House",
  "Dance Pop",
  "DubStep",
  "Trap",
];

const GenreSelect: React.FC<GenreSelectProps> = ({
  onGenreChange,
  className,
  defaultValue,
}) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    defaultValue || []
  );

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prevGenres) => {
      if (prevGenres.includes(genre)) {
        return prevGenres.filter((g) => g !== genre);
      } else {
        return [...prevGenres, genre];
      }
    });
  };

  React.useEffect(() => {
    onGenreChange(selectedGenres);
  }, [selectedGenres]);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {genres.map((genre) => (
        <button
          key={genre}
          type="button"
          onClick={() => handleGenreToggle(genre)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium",
            selectedGenres.includes(genre)
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreSelect;
