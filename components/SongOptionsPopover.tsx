"use client";

import { Song } from "@/types";
import { BsThreeDots } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LikeButton from "@/components/LikeButton";
import DeletePlaylistSongsBtn from "@/components/DeletePlaylistSongsBtn";
import { useState } from "react";
import PreviewDownloadModal from "@/components/Modals/DownloadPreviewModal";
import useDownload from "@/hooks/data/useDownload";
import useLoadMedia from "@/hooks/data/useLoadMedia";
import { Download } from "lucide-react";
import { downloadFile } from "@/libs/helpers";

interface SongOptionsPopoverProps {
  song: Song;
  playlistId?: string;
}

const SongOptionsPopover: React.FC<SongOptionsPopoverProps> = ({
  song,
  playlistId,
}) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const { fileUrl: audioUrl } = useDownload(song.song_path);
  const videoUrl = useLoadMedia(song, { type: "video", bucket: "videos" })?.[0];
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadClick = async (type: "audio" | "video") => {
    setIsLoading(true);

    if (type === "audio" && song?.song_path && audioUrl) {
      await downloadFile(audioUrl, `${song.title || "Untitled"}.mp3`);
    }

    if (type === "video" && videoUrl) {
      await downloadFile(videoUrl, `${song.title || "Untitled"}.mp4`);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            aria-label="More Options"
          >
            <BsThreeDots size={20} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          className="w-48 p-0 bg-neutral-800 border-neutral-700"
        >
          <div className="flex flex-col text-sm">
            <div className="px-4 py-3">
              <LikeButton
                songId={song.id}
                songType={"regular"}
                showText={true}
              />
            </div>

            {playlistId && (
              <div className="px-4 py-3">
                <DeletePlaylistSongsBtn
                  songId={song.id}
                  playlistId={playlistId}
                  songType={"regular"}
                  showText={true}
                />
              </div>
            )}
            {/* ダウンロードオプション */}
            <div className="px-4 py-3">
              <button
                className=" w-full flex items-center text-neutral-400 cursor-pointer hover:text-white hover:filter hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"
                onClick={() => setIsDownloadModalOpen(true)}
              >
                <Download size={28} className="mr-2" />
                ダウンロード
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* ダウンロードプレビューモーダル */}
      <PreviewDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title={song.title}
        audioUrl={audioUrl || undefined}
        videoUrl={videoUrl || undefined}
        handleDownloadClick={handleDownloadClick}
      />
    </>
  );
};

export default SongOptionsPopover;
