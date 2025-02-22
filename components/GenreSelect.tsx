"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { BsChevronDown } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

interface GenreSelectProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  value?: string;
}

const genres = [
  "j-pop",
  "j-rock",
  "anime",
  "pop",
  "rock",
  "electronic",
  "jazz",
  "classical",
  "hip-hop",
  "r&b",
  "folk",
  "other",
];

const GenreSelect: React.FC<GenreSelectProps> = ({
  disabled,
  onChange,
  value,
}) => {
  return (
    <RadixSelect.Root
      defaultValue={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <RadixSelect.Trigger
        className={twMerge(
          "flex items-center justify-between w-full rounded-xl px-4 py-3",
          "bg-neutral-900/60 backdrop-blur-sm border border-white/[0.02]",
          "hover:border-purple-500/20 focus:border-purple-500/30",
          "transition-all duration-300 group relative",
          "text-sm font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <RadixSelect.Value
          placeholder="ジャンルを選択"
          className="text-neutral-400 group-hover:text-neutral-300"
        />
        <RadixSelect.Icon>
          <BsChevronDown
            size={16}
            className="text-neutral-400 group-hover:text-neutral-300 transition-transform duration-300 group-data-[state=open]:rotate-180"
          />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content className="overflow-hidden bg-neutral-900/95 backdrop-blur-xl rounded-xl border border-white/[0.02] shadow-xl animate-scale-in z-[9999]">
          <RadixSelect.Viewport className="p-2">
            {genres.map((genre) => (
              <RadixSelect.Item
                key={genre}
                value={genre}
                className={twMerge(
                  "relative flex items-center px-8 py-2 rounded-lg text-sm",
                  "text-neutral-300 hover:text-white",
                  "focus:bg-purple-500/10 focus:text-purple-400 focus:outline-none",
                  "cursor-pointer transition-all duration-300",
                  "data-[state=checked]:text-purple-400 data-[state=checked]:bg-purple-500/10"
                )}
              >
                <RadixSelect.ItemText className="capitalize">
                  {genre}
                </RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};

export default GenreSelect;
