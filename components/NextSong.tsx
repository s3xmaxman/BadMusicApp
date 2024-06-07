"use client";
import { Song } from "@/types";
import Image from "next/image";

interface NextSongProps {
  title: string | undefined;
  image_path: string | undefined | null;
  author: string | undefined;
}

const NextSong = ({ title, image_path, author }: NextSongProps) => {
  return (
    <div className="w-full flex items-center gap-x-16 cursor-pointer hover:bg-neutral-800 rounded-md p-3">
      <Image
        src={image_path || "/images/playlist.png"}
        alt={"Next Song"}
        width={100}
        height={100}
        className="rounded-xl"
      />
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-neutral-400">{author}</p>
      </div>
    </div>
  );
};

export default NextSong;
