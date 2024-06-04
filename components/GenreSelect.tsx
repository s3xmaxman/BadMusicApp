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

const music = ["Nu Disco", "Vapor Wave", "Electro House", "Dance Pop"];

const GenreSelect = () => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a genre" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Genre</SelectLabel>
          {music.map((genre: string) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default GenreSelect;
