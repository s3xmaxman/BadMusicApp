"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiOutlineBars, AiOutlinePlus } from "react-icons/ai";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import usePlaylistModal from "@/hooks/usePlaylistModal";
import { Playlist, Song } from "@/types";
import MediaItem from "../MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { useState } from "react";
import { MdMusicNote } from "react-icons/md";
import { MdOutlineQueueMusic } from "react-icons/md";
import Hover from "../Hover";
import useSunoModal from "@/hooks/useSunoModal";
import Image from "next/image";

interface LibraryProps {
  songs: Song[];
  playlists: Playlist[];
  isCollapsed: boolean;
}

const Library: React.FC<LibraryProps> = ({ songs, playlists, isCollapsed }) => {
  const authModal = useAuthModal();
  const { user } = useUser();
  const uploadModal = useUploadModal();
  const playlistModal = usePlaylistModal();
  const sunoModal = useSunoModal();
  const onPlay = useOnPlay(songs);
  const [selectedTab, setSelectedTab] = useState("music");

  const openCreate = () => {
    if (!user) {
      return authModal.onOpen();
    }

    return uploadModal.onOpen();
  };

  const openPlaylist = () => {
    if (!user) {
      return authModal.onOpen();
    }

    return playlistModal.onOpen();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-4">
          {!isCollapsed && (
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="rounded-full">
                <TabsTrigger value="music" className="rounded-full">
                  <Hover contentSize="w-24" description="楽曲">
                    <MdMusicNote size={25} />
                  </Hover>
                </TabsTrigger>
                <TabsTrigger value="playlist" className="rounded-full">
                  <Hover contentSize="w-24" description="プレイリスト">
                    <MdOutlineQueueMusic size={25} />
                  </Hover>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        {!isCollapsed && (
          <div className="flex gap-x-4">
            <Hover contentSize="w-24" description="SUNO">
              <Image
                src="/suno.png"
                alt="suno"
                width={20}
                height={20}
                onClick={sunoModal.onOpen}
                className="text-neutral-400 cursor-pointer hover:text-white transition"
              />
            </Hover>

            <Hover contentSize="w-40" description="プレイリストを作成">
              <AiOutlineBars
                className="text-neutral-400 cursor-pointer hover:text-white transition"
                size={20}
                onClick={openPlaylist}
              />
            </Hover>

            <Hover contentSize="w-24" description="曲を追加">
              <AiOutlinePlus
                onClick={openCreate}
                size={20}
                className="text-neutral-400 cursor-pointer hover:text-white transition"
              />
            </Hover>
          </div>
        )}
      </div>
      <div
        className={`flex flex-col gap-y-2 mt-4 px-3 ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        {selectedTab === "music" &&
          songs.map((item) => (
            <MediaItem
              onClick={(id: string) => onPlay(id)}
              key={item.id}
              data={item}
              isCollapsed={isCollapsed}
            />
          ))}
        {selectedTab === "playlist" &&
          playlists.map((item) => (
            <MediaItem key={item.id} data={item} isCollapsed={isCollapsed} />
          ))}
      </div>
    </div>
  );
};

export default Library;
