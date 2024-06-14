"use client";
import { useState, useEffect } from "react";
import { Song } from "@/types";
import useLoadImages from "@/hooks/useLoadImages";
import Image from "next/image";
import Link from "next/link";
import useOnPlay from "@/hooks/useOnPlay";
import useGetTrendSongs from "@/hooks/useGetTrendSongs";
import { cn } from "@/libs/utils";

const TrendBoard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "all" | "month" | "week" | "day"
  >("all");
  const [trends, setTrends] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async (period: "all" | "month" | "week" | "day") => {
    setIsLoading(true);
    setError(null);

    try {
      const songs = await useGetTrendSongs(period);
      setTrends(songs);
    } catch (err) {
      setError("トレンドデータの取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(selectedPeriod);
  }, [selectedPeriod]);

  const imageUrls = useLoadImages(trends);
  const onPlay = useOnPlay(trends);

  const handleChange = (value: string) => {
    setSelectedPeriod(value as "all" | "month" | "week" | "day");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end mr-2">
        <select
          value={selectedPeriod}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-neutral-900 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Today</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading && (
          <p className="text-center col-span-full text-white">Loading...</p>
        )}
        {error && (
          <p className="text-red-500 text-center col-span-full">{error}</p>
        )}
        {!isLoading &&
          !error &&
          trends.map((song, index) => (
            <Link
              key={song.id}
              href={`/songs/${song.id}`}
              className="group block transform transition duration-300 hover:scale-105"
            >
              <div className="relative w-full h-60 overflow-hidden rounded-xl bg-black shadow-lg">
                <Image
                  src={imageUrls[index] || ""}
                  alt={song.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl group-hover:scale-110 transition duration-300"
                />
                <div
                  onClick={(e) => {
                    e.preventDefault(); // リンクの遷移を防ぐ
                    onPlay(song.id);
                  }}
                  className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center"
                >
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white text-xl font-bold mb-1 flex items-center space-x-2">
                  <span className="text-green-400">#{index + 1}</span>
                  <span className={cn("truncate", "hover:underline")}>
                    {song.title}
                  </span>
                </h3>
                <p className="text-gray-400 text-sm">{song.author}</p>
                <p className="text-gray-500 text-xs mt-2">{song.count} plays</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default TrendBoard;
