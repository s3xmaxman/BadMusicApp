import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenreSelectProps {
  onGenreChange: (genre: string) => void;
}

const genres = [
  "All",
  "Nu Disco",
  "Vapor Wave",
  "Electro House",
  "Dance Pop",
  "DubStep",
];

const GenreSelect: React.FC<GenreSelectProps> = ({ onGenreChange }) => {
  const [selectedGenre, setSelectedGenre] = React.useState("All");

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    onGenreChange(genre);
  };
  return (
    <Select onValueChange={handleGenreChange} value={selectedGenre}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="ジャンルを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {genres.map((genre: string) => (
            <SelectItem
              className="bg-neutral-900 group-hover:bg-neutral-900"
              key={genre}
              value={genre}
            >
              {genre}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default GenreSelect;
