import { useState } from "react";

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
  className?: string;
}

const genres = [
  "All",
  "Nu Disco",
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
}) => {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    onGenreChange(genre);
  };
  return (
    <Select onValueChange={handleGenreChange} value={selectedGenre}>
      <SelectTrigger className={`w-[180px] ${className}`}>
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
