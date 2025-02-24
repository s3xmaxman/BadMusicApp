"use client";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import PageContent from "./PageContent";
import TrendBoard from "@/components/TrendBoard";
import { Song, Spotlight } from "@/types";
import GenreCard from "@/components/GenreCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { videoIds } from "@/constants";
import SpotlightBoard from "@/components/SpotlightBoard";
import HomeHeader from "@/components/HomeHeader";
import useMobilePlayer from "@/hooks/player/useMobilePlayer";

const YouTubePlayer = dynamic(() => import("@/components/YouTubePlayer"), {
  ssr: false,
});

export const genreCards = [
  { id: 1, name: "Retro Wave", color: "bg-purple-500" },
  { id: 2, name: "Electro House", color: "bg-blue-500" },
  { id: 3, name: "Nu Disco", color: "bg-red-500" },
  { id: 4, name: "City Pop", color: "bg-green-500" },
  { id: 5, name: "Tropical House", color: "bg-yellow-500" },
  { id: 6, name: "Vapor Wave", color: "bg-indigo-500" },
  { id: 7, name: "Trance", color: "bg-pink-500" },
  { id: 8, name: "Drum and Bass", color: "bg-orange-500" },
];

interface HomeClientProps {
  songs: Song[];
  spotlightData: Spotlight[];
}

const HomeContent: React.FC<HomeClientProps> = ({ songs, spotlightData }) => {
  const { isMobilePlayer, toggleMobilePlayer } = useMobilePlayer();
  const [showArrows, setShowArrows] = useState(false);
  const [showVideoArrows, setShowVideoArrows] = useState(false);
  const [showTrendBoardArrows, setShowTrendBoardArrows] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const genreScrollRef = useRef<HTMLDivElement>(null);
  const videoScrollRef = useRef<HTMLDivElement>(null);
  const trendBoardScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isClient) {
    return null;
  }

  const scroll = (
    ref: React.RefObject<HTMLDivElement>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const containerWidth = ref.current.clientWidth;
      const scrollAmount =
        direction === "left" ? -containerWidth * 0.8 : containerWidth * 0.8;

      ref.current.scrollBy({
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

  const scrollVideos = (direction: "left" | "right") => {
    scroll(videoScrollRef, direction);
  };

  const handleTrendBoardScroll = (direction: "left" | "right") => {
    scroll(trendBoardScrollRef, direction);
  };

  const handleGenreScroll = (direction: "left" | "right") => {
    scroll(genreScrollRef, direction);
  };

  return (
    <div className="flex bg-[#0d0d0d] h-full overflow-hidden">
      <div className="w-full  h-full overflow-y-auto custom-scrollbar">
        {isMobile && !isMobilePlayer && <HomeHeader />}
        <main className="px-6 py-8 pb-[70px] md:pb-8 space-y-8">
          {/* Trending Section */}
          <section
            onMouseEnter={() => setShowTrendBoardArrows(true)}
            onMouseLeave={() => setShowTrendBoardArrows(false)}
          >
            <TrendBoard
              scrollRef={trendBoardScrollRef}
              showArrows={showTrendBoardArrows}
              onScroll={handleTrendBoardScroll}
            />
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
                  className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide smooth-scroll"
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

          <section>
            <SpotlightBoard spotlightData={spotlightData} />
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
                  onClick={() => handleGenreScroll("left")}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <div
                ref={genreScrollRef}
                className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide smooth-scroll"
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
                  onClick={() => handleGenreScroll("right")}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
          </section>

          {/* Latest Songs Section */}
          <section>
            <PageContent songs={songs} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomeContent;
