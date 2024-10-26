import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SunoSong } from "@/types";
import { CiMusicNote1 } from "react-icons/ci";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Loader2, MoreVertical, Trash, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface SunoSongItemProps {
  onClick: (id: string) => void;
  data: SunoSong;
  onDelete?: () => void;
}

const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url, {
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    const blobURL = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobURL);
  } catch (error) {
    console.error("ダウンロードに失敗しました:", error);
    // TODO: ユーザーへのフィードバックを追加
  }
};

const SunoSongItem: React.FC<SunoSongItemProps> = ({
  onClick,
  data,
  onDelete,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(data.status === "complete");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const handleDelete = async () => {
    try {
      await supabaseClient
        .from("suno_songs")
        .delete()
        .eq("song_id", data.song_id);

      setIsDeleteAlertOpen(false);
      onDelete?.();
    } catch (error) {
      console.error("Failed to delete song:", error);
    }
  };

  const handleOpenDeleteAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsDeleteAlertOpen(true);
  };

  const handleCancelDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsDeleteAlertOpen(false);
  };

  const handleConfirmDelete = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    await handleDelete();
  };

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

  const handleDownload = useCallback(
    async (type: "audio" | "video") => {
      if (type === "audio" && data.audio_url) {
        const filename = `${data.title || "Untitled"}.mp3`;
        await downloadFile(data.audio_url, filename);
      } else if (type === "video" && data.video_url) {
        const filename = `${data.title || "Untitled"}.mp4`;
        await downloadFile(data.video_url, filename);
      }
    },
    [data.audio_url, data.video_url, data.title]
  );

  return (
    <>
      {/* Song Item Container */}
      <div
        className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3"
        onClick={(e) => {
          e.stopPropagation();
          if (!isDeleteAlertOpen) {
            onClick(data.song_id || "");
          }
        }}
      >
        {/* Dropdown Menu for Download and Delete Options */}
        <div
          className="absolute top-2 right-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {data.audio_url && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload("audio");
                  }}
                >
                  <CiMusicNote1 className="mr-2 h-4 w-4" />
                  音楽をDL
                </DropdownMenuItem>
              )}
              {data.video_url && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload("video");
                  }}
                >
                  <Video className="mr-2 h-4 w-4" />
                  動画をDL
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={handleOpenDeleteAlert}
              >
                <Trash className="mr-2 h-4 w-4" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Delete Confirmation Alert */}
        <AlertDialog
          open={isDeleteAlertOpen}
          onOpenChange={(open) => {
            if (!open) handleCancelDelete();
          }}
        >
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                「{data.title || "Untitled"}」を削除してもよろしいですか？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>
                キャンセル
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Song Image and Model Name */}
        <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
          {/* Loading Placeholder */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-300 animate-pulse" />
          )}
          {/* Song Image */}
          <Image
            className={`object-cover w-full h-full transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={data.image_url || "/images/wait.jpg"}
            fill
            alt={data.title}
            onLoad={() => setIsImageLoaded(true)}
          />
          {/* Model Name Display */}
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
            {data.model_name}
          </div>

          {/* Generating Status Overlay */}
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

        {/* Song Information */}
        <div className="flex flex-col items-start justify-between w-full pt-4 gap-y-1">
          {/* Song Title Link */}
          <Link
            href={`/suno-songs/${data.song_id}`}
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold truncate w-full hover:underline">
              {data.title || "Untitled"}
            </p>
          </Link>

          {/* Song Type, Tags, and Created Date */}
          <div className="flex items-center justify-between w-full mt-2 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <CiMusicNote1 className="mr-1" />
                {data.type || "Generated"}
              </div>
              {/* {data.tags && (
                <div className="flex items-center">
                  <CiMusicNote1 className="mr-1" />
                  {data.tags.split(",")[0]}
                </div>
              )} */}
            </div>
            <div>{formatDate(data.created_at)}</div>
          </div>

          {/* Generating Status Indicator */}
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
    </>
  );
};

export default SunoSongItem;
