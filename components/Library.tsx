"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiOutlineBars, AiOutlinePlus } from "react-icons/ai";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import usePlaylistModal from "@/hooks/usePlaylistModal";
import { Playlist, Song } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { useState } from "react";
import { MdMusicNote } from "react-icons/md";
import { MdOutlineQueueMusic } from "react-icons/md";

interface LibraryProps {
  songs: Song[];
  playlists: Playlist[];
}

const Library: React.FC<LibraryProps> = ({ songs, playlists }) => {
  const authModal = useAuthModal();
  const { user } = useUser();
  const uploadModal = useUploadModal();
  const playlistModal = usePlaylistModal();
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
        <div className=" inline-flex items-center gap-x-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="rounded-full">
              <TabsTrigger value="music" className="rounded-full">
                <MdMusicNote size={25} />
              </TabsTrigger>
              <TabsTrigger value="playlist" className="rounded-full">
                <MdOutlineQueueMusic size={25} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <AiOutlineBars
          className="text-neutral-400 cursor-pointer hover:text-white transition"
          size={20}
          onClick={openPlaylist}
        />
        <AiOutlinePlus
          onClick={openCreate}
          size={20}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {selectedTab === "music" &&
          songs.map((item) => (
            <MediaItem
              onClick={(id: string) => onPlay(id)}
              key={item.id}
              data={item}
            />
          ))}
        {selectedTab === "playlist" &&
          playlists.map((item) => <MediaItem key={item.id} data={item} />)}
      </div>
    </div>
  );
};

export default Library;
