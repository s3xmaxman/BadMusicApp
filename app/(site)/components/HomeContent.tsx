"use client";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import PageContent from "./PageContent";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import TrendBoard from "@/components/TrendBoard";
import { Song } from "@/types";
import GenreCard from "@/components/GenreCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const YouTubePlayer = dynamic(() => import("@/components/YouTubePlayer"), {
  ssr: false,
});

const SoundCloudPlayer = dynamic(() => import("@/components/SoundCloud"), {
  ssr: false,
});

interface HomeClientProps {
  songs: Song[];
}

const videoIds = [
  { id: 1, name: "synthwave radio", videoId: "4xDzrJKXOOY" },
  { id: 2, name: "lofi hip hop radio", videoId: "jfKfPfyJRdk" },
  { id: 3, name: "dark ambient radio", videoId: "S_MOd40zlYU" },
  { id: 4, name: "Blade Runner Radio", videoId: "RrkrdYm3HPQ" },
  { id: 5, name: "Future Funk Radio ♫", videoId: "37oqv4Tjny4" },
  { id: 6, name: "tokyo night drive", videoId: "Lcdi9O2XB4E" },
];

const genreCards = [
  { id: 1, name: "Retro Wave", color: "bg-purple-500" },
  { id: 2, name: "Electro House", color: "bg-blue-500" },
  { id: 3, name: "Nu Disco", color: "bg-red-500" },
  { id: 4, name: "City Pop", color: "bg-green-500" },
  { id: 5, name: "Tropical House", color: "bg-yellow-500" },
  { id: 6, name: "Vapor Wave", color: "bg-indigo-500" },
  { id: 7, name: "Trance", color: "bg-pink-500" },
  { id: 8, name: "Drum and Bass", color: "bg-orange-500" },
];

const HomeContent: React.FC<HomeClientProps> = ({ songs }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [showVideoArrows, setShowVideoArrows] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const genreScrollRef = useRef<HTMLDivElement>(null);
  const videoScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isClient) {
    return null;
  }

  const scrollVideos = (direction: "left" | "right") => {
    if (videoScrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      videoScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const changeVideo = (direction: "prev" | "next") => {
    setCurrentVideoIndex((prevIndex) => {
      if (direction === "prev") {
        return prevIndex > 0 ? prevIndex - 1 : videoIds.length - 1;
      } else {
        return prevIndex < videoIds.length - 1 ? prevIndex + 1 : 0;
      }
    });
  };

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
          <section
            className="relative"
            onMouseEnter={() => setShowVideoArrows(true)}
            onMouseLeave={() => setShowVideoArrows(false)}
          >
            {isMobile ? (
              <div className="w-full">
                <YouTubePlayer
                  name={videoIds[currentVideoIndex].name}
                  videoId={videoIds[currentVideoIndex].videoId}
                />
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => changeVideo("prev")}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => changeVideo("next")}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                {showVideoArrows && (
                  <button
                    onClick={() => scrollVideos("left")}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75 transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                <div
                  ref={videoScrollRef}
                  className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
                  style={{ width: "calc(100% + 1rem)" }}
                >
                  {videoIds.map((video) => (
                    <div key={video.id} className="w-1/3 shrink-0">
                      <YouTubePlayer
                        name={video.name}
                        videoId={video.videoId}
                      />
                    </div>
                  ))}
                </div>
                {showVideoArrows && (
                  <button
                    onClick={() => scrollVideos("right")}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75 transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>
            )}
          </section>
          {/* SoundCloud Player */}
          <section>
            <SoundCloudPlayer />
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
              {showArrows && !isMobile && (
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
                {genreCards.map((genre) => (
                  <GenreCard
                    key={genre.id}
                    genre={genre.name}
                    color={genre.color}
                  />
                ))}
              </div>
              {showArrows && !isMobile && (
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
