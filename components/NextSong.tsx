"use client";
import Image from "next/image";

interface Props {}

const NextSong: React.FC<Props> = () => {
  return (
    <div className="w-full flex items-center gap-x-16 cursor-pointer hover:bg-neutral-800 rounded-md p-3">
      <Image
        src={"/images/playlist.png"}
        alt={"Next Song"}
        width={100}
        height={100}
        className="rounded-xl"
      />
      <div>
        <h2 className="text-lg font-semibold text-white">test Song</h2>
        <p className="text-sm text-neutral-400">test artist</p>
      </div>
    </div>
  );
};

export default NextSong;
