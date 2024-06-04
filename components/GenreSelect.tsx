import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const genres = [
  "All",
  "Nu Disco",
  "Vapor Wave",
  "Electro House",
  "Dance Pop",
  "Dubstep",
];

const GenreSelect = () => {
  return (
    <Select>
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
