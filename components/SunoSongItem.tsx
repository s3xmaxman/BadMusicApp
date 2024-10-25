import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SunoSong } from "@/types";
import { CiMusicNote1 } from "react-icons/ci";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";

interface SunoSongItemProps {
  onClick: (id: string) => void;
  data: SunoSong;
}

const SunoSongItem: React.FC<SunoSongItemProps> = ({ onClick, data }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(data.status === "complete");
  const supabaseClient = useSupabaseClient();

  const updateSongStatus = useCallback(async () => {
    if (isCompleted) return;

    try {
      const response = await fetch(`/api/suno/get?id=${data.song_id}`);
      const [updatedSong] = await response.json();

      if (updatedSong.status === data.status) return;

      await supabaseClient
        .from("suno_songs")
        .update({
          status: updatedSong.status,
          audio_url: updatedSong.audio_url,
          video_url: updatedSong.video_url,
        })
        .eq("song_id", data.song_id);

      setIsCompleted(updatedSong.status === "complete");
    } catch (error) {
      console.error("Failed to update song status:", error);
    }
  }, [data.song_id, data.status, supabaseClient, isCompleted]);

  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(updateSongStatus, 30000);
    return () => clearInterval(interval);
  }, [isCompleted, updateSongStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3">
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}
        <Image
          className={`object-cover w-full h-full transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={data.image_url || "/images/wait.jpg"}
          fill
          alt={data.title}
          onLoad={() => setIsImageLoaded(true)}
          onClick={() => onClick(data.song_id || "")}
        />
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
          {data.model_name}
        </div>

        {/* Generation Animation Overlay */}
        {data.status === "gen" && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping" />
              <div className="absolute -inset-4 bg-blue-500/40 rounded-full animate-pulse" />
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
            <div className="mt-4 text-sm font-medium text-white">
              Generating...
            </div>
            <div className="mt-2 text-xs text-blue-200 animate-pulse">
              This may take a few minutes
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start justify-between w-full pt-4 gap-y-1">
        <Link href={`/suno-songs/${data.song_id}`} className="w-full">
          <p className="font-semibold truncate w-full hover:underline">
            {data.title || "Untitled"}
          </p>
        </Link>

        <div className="text-neutral-400 text-sm w-full truncate">
          {data.prompt}
        </div>

        <div className="flex items-center justify-between w-full mt-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <CiMusicNote1 className="mr-1" />
              {data.type || "Generated"}
            </div>
            {data.tags && (
              <div className="flex items-center">
                <CiMusicNote1 className="mr-1" />
                {data.tags.split(",")[0]}
              </div>
            )}
          </div>
          <div>{formatDate(data.created_at)}</div>
        </div>

        {data.status && data.status !== "complete" && (
          <div
            className={`
            absolute top-2 left-2 px-2 py-1 rounded-full text-xs
            ${
              data.status === "gen"
                ? "bg-blue-500/80 text-white animate-pulse"
                : "bg-blue-500 text-white"
            }
          `}
          >
            {data.status}
          </div>
        )}
      </div>
    </div>
  );
};

export default SunoSongItem;
