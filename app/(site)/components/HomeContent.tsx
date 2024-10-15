"use client";
import { useState, useRef } from "react";
import Header from "@/components/Header";
import PageContent from "./PageContent";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import TrendBoard from "@/components/TrendBoard";
import { Song } from "@/types";
import GenreCard from "@/components/GenreCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import YouTubePlayer from "@/components/YouTubePlayer";

interface HomeClientProps {
  songs: Song[];
}

const genres = [
  { name: "Retro Wave", color: "bg-purple-500" },
  { name: "Electro House", color: "bg-blue-500" },
  { name: "Nu Disco", color: "bg-red-500" },
  { name: "City Pop", color: "bg-green-500" },
  { name: "Tropical House", color: "bg-yellow-500" },
  { name: "Vapor Wave", color: "bg-indigo-500" },
  { name: "Trance", color: "bg-pink-500" },
  { name: "Drum and Bass", color: "bg-orange-500" },
];

const videoIds = [
  { name: "synthwave radio", videoId: "4xDzrJKXOOY" },
  { name: "lofi hip hop radio", videoId: "jfKfPfyJRdk" },
  { name: "dark ambient radio", videoId: "S_MOd40zlYU" },
];

const HomeContent: React.FC<HomeClientProps> = ({ songs }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const genreScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (genreScrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      genreScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex bg-[#0d0d0d] h-full overflow-hidden">
      <div className="w-full lg:w-[calc(100%-24rem)] h-full overflow-y-auto custom-scrollbar">
        <Header>
          <div className="mb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
              {/* Header content goes here */}
            </div>
          </div>
        </Header>
        <main className="px-6 py-8 space-y-8">
          {/* Trending Section */}
          <section>
            <TrendBoard />
          </section>
          {/* YouTubePlayer Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoIds.map((video) => (
              <div key={video.videoId} className="col-span-1">
                <YouTubePlayer name={video.name} videoId={video.videoId} />
              </div>
            ))}
          </section>
          {/* Genres Section */}
          <section
            className="relative"
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
          >
            <h2 className="text-white text-2xl font-semibold mb-4">
              Top Genres
            </h2>
            <div className="relative">
              {showArrows && (
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <div
                ref={genreScrollRef}
                className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
              >
                {genres.map((genre) => (
                  <GenreCard
                    key={genre.name}
                    genre={genre.name}
                    color={genre.color}
                  />
                ))}
              </div>
              {showArrows && (
                <button
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
          </section>
          {/* Latest Songs Section */}
          <section>
            <h2 className="text-white text-2xl font-semibold">Latest</h2>
            <PageContent songs={songs} setIsMusicPlaying={setIsMusicPlaying} />
          </section>
        </main>
      </div>
      {/* Right Sidebar */}
      <aside className="hidden lg:block w-96 h-full overflow-y-auto bg-black custom-scrollbar">
        <RightSidebar />
      </aside>
    </div>
  );
};

export default HomeContent;
