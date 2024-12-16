"use client";
import { useState } from "react";
import useLoadImages from "@/hooks/useLoadImages";
import Image from "next/image";
import Link from "next/link";
import useOnPlay from "@/hooks/useOnPlay";
import useGetTrendSongs from "@/hooks/useGetTrendSongs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface TrendBoardProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  showArrows: boolean;
  onScroll: (direction: "left" | "right") => void;
}

const TrendBoard: React.FC<TrendBoardProps> = ({
  scrollRef,
  showArrows,
  onScroll,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "all" | "month" | "week" | "day"
  >("all");
  const { trends, isLoading, error } = useGetTrendSongs(selectedPeriod);
  const imageUrls = useLoadImages(trends);
  const onPlay = useOnPlay(trends);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleChange = (value: string) => {
    setSelectedPeriod(value as "all" | "month" | "week" | "day");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mr-1">
        <h2 className="text-white text-2xl font-semibold">Trending</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => handleChange(e.target.value)}
          className="text-[#4c1d95] bg-gradient-to-b from-gray-900 to-black border-[#4c1d95] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c1d95]"
        >
          <option value="all">ALL TIME</option>
          <option value="month">THIS MONTH</option>
          <option value="week">THIS WEEK</option>
          <option value="day">TODAY</option>
        </select>
      </div>

      <div className="relative">
        {showArrows && (
          <button
            onClick={() => onScroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <motion.div
          ref={scrollRef}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        >
          {isLoading && (
            <p className="text-center col-span-full text-cyan-400 animate-pulse">
              LOADING...
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center col-span-full">{error}</p>
          )}
          {!isLoading &&
            !error &&
            trends.map((song, index) => (
              <motion.div
                key={song.id}
                variants={itemVariants}
                className="group relative transform transition duration-300 ease-in-out hover:scale-105 min-w-[300px]"
              >
                <div className="relative w-full h-60 overflow-hidden rounded-xl bg-black shadow-lg">
                  <Image
                    src={imageUrls[index] || "/images/wait.jpg"}
                    alt={song.title}
                    fill
                    objectFit="cover"
                    className="rounded-t-xl group-hover:scale-110 transition duration-300 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition duration-300 ease-in-out" />
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      onPlay(song.id);
                    }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out cursor-pointer"
                  >
                    <svg
                      className="w-12 h-12 text-[#4c1d95] fill-current"
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
                    <span className="text-[#4c1d95]">#{index + 1}</span>
                    <Link href={`/songs/${song.id}`}>
                      <span className="truncate hover:underline">
                        {song.title}
                      </span>
                    </Link>
                  </h3>
                  <p className="text-gray-400 text-sm">{song.author}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {song.count} plays
                  </p>
                </div>
              </motion.div>
            ))}
        </motion.div>

        {showArrows && (
          <button
            onClick={() => onScroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrendBoard;
