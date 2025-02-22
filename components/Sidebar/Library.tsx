"use client";

import { AiOutlineBars, AiOutlinePlus } from "react-icons/ai";
import { RiPlayListFill } from "react-icons/ri";
import { GiMicrophone } from "react-icons/gi";
import useAuthModal from "@/hooks/auth/useAuthModal";
import { useUser } from "@/hooks/auth/useUser";
import useUploadModal from "@/hooks/modal/useUploadModal";
import usePlaylistModal from "@/hooks/modal/usePlaylistModal";
import useSpotLightUploadModal from "@/hooks/modal/useSpotLightUpload";
import Hover from "../Hover";

interface LibraryProps {
  isCollapsed: boolean;
}

const Library: React.FC<LibraryProps> = ({ isCollapsed }) => {
  const { user } = useUser();
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const playlistModal = usePlaylistModal();
  const spotlightUploadModal = useSpotLightUploadModal();

  const openModal = (value: "music" | "playlist" | "spotlight") => {
    if (!user) {
      return authModal.onOpen();
    }

    switch (value) {
      case "music":
        return uploadModal.onOpen();
      case "playlist":
        return playlistModal.onOpen();
      case "spotlight":
        return spotlightUploadModal.onOpen();
    }
  };

  if (isCollapsed) {
    return (
      <div className="flex flex-col gap-3 px-1 pt-4">
        <Hover
          contentSize="w-auto px-3 py-2"
          side="right"
          description="プレイリストを作成"
        >
          <button className="w-full aspect-square rounded-xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-lg border border-white/5 hover:border-purple-500/30 transition-all duration-500 flex items-center justify-center group relative overflow-hidden shadow-lg hover:shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <AiOutlineBars
              className="text-neutral-400 group-hover:text-white transition-all duration-300 transform group-hover:scale-110"
              size={20}
              onClick={() => openModal("playlist")}
            />
          </button>
        </Hover>

        <Hover
          contentSize="w-auto px-3 py-2"
          side="right"
          description="曲を追加"
        >
          <button className="w-full aspect-square rounded-xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-lg border border-white/5 hover:border-purple-500/30 transition-all duration-500 flex items-center justify-center group relative overflow-hidden shadow-lg hover:shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <AiOutlinePlus
              className="text-neutral-400 group-hover:text-white transition-all duration-300 transform group-hover:scale-110"
              size={20}
              onClick={() => openModal("music")}
            />
          </button>
        </Hover>

        <Hover
          contentSize="w-auto px-3 py-2"
          side="right"
          description="スポットライトを作成"
        >
          <button className="w-full aspect-square rounded-xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-lg border border-white/5 hover:border-purple-500/30 transition-all duration-500 flex items-center justify-center group relative overflow-hidden shadow-lg hover:shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <GiMicrophone
              className="text-neutral-400 group-hover:text-white transition-all duration-300 transform group-hover:scale-110"
              size={20}
              onClick={() => openModal("spotlight")}
            />
          </button>
        </Hover>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-3 pt-4">
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => openModal("playlist")}
          className="group w-full p-4 rounded-xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-lg border border-white/5 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden shadow-lg hover:shadow-purple-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-500 shadow-inner">
              <RiPlayListFill
                className="text-purple-400 group-hover:text-purple-300 transition-all duration-300 transform group-hover:scale-110"
                size={24}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
                プレイリストを作成
              </span>
              <span className="text-xs text-neutral-400">
                お気に入りの曲をまとめよう
              </span>
            </div>
          </div>
        </button>

        <button
          onClick={() => openModal("music")}
          className="group w-full p-4 rounded-xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-lg border border-white/5 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden shadow-lg hover:shadow-purple-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-500 shadow-inner">
              <AiOutlinePlus
                className="text-purple-400 group-hover:text-purple-300 transition-all duration-300 transform group-hover:scale-110"
                size={24}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
                曲を追加
              </span>
              <span className="text-xs text-neutral-400">
                新しい曲をアップロード
              </span>
            </div>
          </div>
        </button>

        <button
          onClick={() => openModal("spotlight")}
          className="group w-full p-4 rounded-xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-lg border border-white/5 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden shadow-lg hover:shadow-purple-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-500 shadow-inner">
              <GiMicrophone
                className="text-purple-400 group-hover:text-purple-300 transition-all duration-300 transform group-hover:scale-110"
                size={24}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
                スポットライト
              </span>
              <span className="text-xs text-neutral-400">Spotlightを共有</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Library;
