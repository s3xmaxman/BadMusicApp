"use client";

import { useState } from "react";
import Header from "@/components/Header";
import PageContent from "./PageContent";
import RightSidebar from "@/components/RightSidebar";
import TrendBoard from "@/components/TrendBoard";
import { Song } from "@/types";

interface HomeClientProps {
  songs: Song[];
}

const HomeContent: React.FC<HomeClientProps> = ({ songs }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  return (
    <div className="flex bg-[#0d0d0d] h-full overflow-hidden">
      <div className="w-[1250px] h-full overflow-y-auto custom-scrollbar ">
        <Header>
          <div className="mb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4"></div>
          </div>
        </Header>

        <div className="mt-2 mb-7 px-6">
          <div className="mb-8">
            <TrendBoard />
          </div>

          <div className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-semibold">最新曲</h1>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-auto md:mr-4">
              <PageContent
                songs={songs}
                setIsMusicPlaying={setIsMusicPlaying}
              />
            </div>
          </div>
        </div>
      </div>
      {true && (
        <div className="hidden lg:block h-full w-96 overflow-y-auto bg-black custom-scrollbar">
          <RightSidebar />
        </div>
      )}
    </div>
  );
};

export default HomeContent;
