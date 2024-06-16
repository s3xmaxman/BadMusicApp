"use client";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import Link from "next/link";
import PlayButton from "./PlayButton";
import { CiPlay1 } from "react-icons/ci";

interface SongItemProps {
  onClick: (id: string) => void;
  data: Song;
}

const SongItem: React.FC<SongItemProps> = ({ onClick, data }) => {
  const imagePath = useLoadImage(data);
  return (
    <div
      className="
        relative 
        group 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-md 
        overflow-hidden 
        gap-x-4 
        bg-neutral-400/5 
        cursor-pointer 
        hover:bg-neutral-400/10 
        transition 
        p-3
        "
    >
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={imagePath || "/images/wait.jpg"}
          fill
          alt="Image"
          onClick={() => onClick(data.id)}
        />
      </div>
      <div className="flex flex-col items-start justify-between w-full pt-4 gap-y-1">
        <Link href={`/songs/${data.id}`} className="w-full">
          <p className="font-semibold truncate w-full hover:underline">
            {data.title}
          </p>
        </Link>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">
          {data.author}
        </p>
        <div className="flex items-center self-end">
          <CiPlay1 />
          <div className="text-white ml-1">{data.count}</div>
        </div>
      </div>
      <div className="absolute bottom-35 right-5">
        <PlayButton />
      </div>
    </div>
  );
};

export default SongItem;
