"use client";

import SongItem from "@/components/SongItem";
import SunoSongItem from "@/components/SunoSongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song, SunoSong } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music2, Mic2 } from "lucide-react";
import useOnPlaySuno from "@/hooks/useOnPlaySuno";
import { useState } from "react";
import usePlayer from "@/hooks/usePlayer";

interface PageContentProps {
  songs: Song[];
  sunoSongs: SunoSong[];
}

//TODO: Sunoタブで曲を再生中にページ遷移すると、アクティブタブがsongsに切り替わり、再生すべき曲IDが正しく保持されない問題を修正する
const PageContent: React.FC<PageContentProps> = ({ songs, sunoSongs }) => {
  const player = usePlayer();
  const onPlay = useOnPlay(songs);
  const onPlaySuno = useOnPlaySuno(sunoSongs);
  const [activeTab, setActiveTab] = useState<"songs" | "suno">("songs");

  if (!songs || !sunoSongs) {
    return (
      <div className="mt-4 text-neutral-400">
        <h1>Loading...</h1>
      </div>
    );
  }

  const handlePlay = (id: string) => {
    if (activeTab === "suno") {
      onPlaySuno(id);
      player.setId(id, true);
    } else {
      onPlay(id);
      player.setId(id, false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Latest Songs
              </h2>
              <p className="text-sm text-neutral-400">
                Discover your new favorite tracks
              </p>
            </div>
          </div>

          <Tabs
            defaultValue="songs"
            className="w-full"
            onValueChange={(value) => setActiveTab(value as "songs" | "suno")}
          >
            <div className="relative border-b border-neutral-800">
              <TabsList className="bg-transparent relative">
                <TabsTrigger
                  value="songs"
                  className="group relative px-8 py-3 data-[state=active]:bg-transparent"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-data-[state=active]:opacity-10 transition-opacity duration-300 rounded-t-lg" />
                  <div className="relative flex items-center space-x-2">
                    <Music2 className="w-4 h-4" />
                    <span>Songs</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300" />
                </TabsTrigger>
                <TabsTrigger
                  value="suno"
                  className="group relative px-8 py-3 data-[state=active]:bg-transparent"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 group-data-[state=active]:opacity-10 transition-opacity duration-300 rounded-t-lg" />
                  <div className="relative flex items-center space-x-2">
                    <Mic2 className="w-4 h-4" />
                    <span>Suno</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300" />
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="songs"
              className="pt-8 transition-all duration-300 animate-in fade-in-50"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {songs.map((item) => (
                  <SongItem
                    onClick={(id) => handlePlay(id)}
                    key={item.id}
                    data={item}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="suno"
              className="pt-8 transition-all duration-300 animate-in fade-in-50"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {sunoSongs.map((item) => {
                  return (
                    <SunoSongItem
                      onClick={(id) => {
                        handlePlay(id);
                      }}
                      key={item.id}
                      data={item}
                    />
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PageContent;
