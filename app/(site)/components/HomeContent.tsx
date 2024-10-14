"use client";

import { useState } from "react";
import Header from "@/components/Header";
import PageContent from "./PageContent";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import TrendBoard from "@/components/TrendBoard";
import { Song } from "@/types";
import GenreCard from "@/components/GenreCard";

interface HomeClientProps {
  songs: Song[];
}

const genres = [
  { name: "Retro Wave", color: "bg-purple-500" },
  { name: "Electro House", color: "bg-blue-500" },
  { name: "Nu Disco", color: "bg-red-500" },
];

const HomeContent: React.FC<HomeClientProps> = ({ songs }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

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

          {/* Genres Section */}
          <section>
            <h2 className="text-white text-2xl font-semibold mb-4">
              Top Genres
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {genres.map((genre) => (
                <GenreCard
                  key={genre.name}
                  genre={genre.name}
                  color={genre.color}
                />
              ))}
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
