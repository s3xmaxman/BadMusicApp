"use client";
import { Song } from "@/types";
import useLoadImages from "@/hooks/useLoadImages";
import Image from "next/image";
import Link from "next/link";
import useOnPlay from "@/hooks/useOnPlay";

interface TrendBoardProps {
  trendSongs: Song[];
}

const TrendBoard: React.FC<TrendBoardProps> = ({ trendSongs }) => {
  const imageUrls = useLoadImages(trendSongs);
  const onPlay = useOnPlay(trendSongs);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 p-4">
      {trendSongs.map((song, index) => (
        <div
          key={song.id}
          className="bg-black rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <div onClick={() => onPlay(song.id)} className="relative w-full h-60">
            <Image
              src={imageUrls[index] || "/images/liked.png"}
              alt={song.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-xl"
            />
          </div>
          <div className="p-4">
            <h3 className="text-white text-xl font-bold mb-1 flex items-center space-x-2">
              <span className="text-green-400">#{index + 1}</span>
              <Link href={`/songs/${song.id}`}>
                <span className="cursor-pointer hover:underline">
                  {song.title}
                </span>
              </Link>
            </h3>
            <p className="text-gray-400 text-sm">{song.author}</p>
            <p className="text-gray-500 text-xs mt-2">{song.count} plays</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendBoard;
