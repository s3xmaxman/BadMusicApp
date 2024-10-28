import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SunoSong } from "@/types";
import { CiMusicNote1 } from "react-icons/ci";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Download,
  Loader2,
  MoreVertical,
  Trash,
  CheckCircle2,
} from "lucide-react";
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
import { downloadFile } from "@/libs/helpers";
import PreviewDownloadModal from "./Modals/DownloadPreviewModal";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface SunoSongItemProps {
  onClick: (id: string) => void;
  data: SunoSong;
  onDelete?: () => void;
}

const SunoSongItem: React.FC<SunoSongItemProps> = ({
  onClick,
  data,
  onDelete,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(data.status === "complete");
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentSongData, setCurrentSongData] = useState(data);
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  // APIを使用して曲の状態を更新する関数
  const updateSongStatus = useCallback(async () => {
    if (isCompleted) return;

    try {
      const response = await fetch(`/api/suno/get?id=${data.song_id}`);
      const songs = await response.json();

      const updatedSong = songs.find(
        (song: any) => song.id === currentSongData.song_id
      );

      if (!updatedSong || updatedSong.status === currentSongData.status) return;

      // Supabaseのデータを更新
      await supabaseClient
        .from("suno_songs")
        .update({
          status: updatedSong.status,
          audio_url: updatedSong.audio_url,
          video_url: updatedSong.video_url,
        })
        .eq("song_id", data.song_id)
        .eq("id", currentSongData.id);

      setCurrentSongData((prevData) => ({
        ...prevData,
        status: updatedSong.status,
        audio_url: updatedSong.audio_url,
        video_url: updatedSong.video_url,
      }));

      if (updatedSong.status === "complete" && !isCompleted) {
        setShowCompletionAnimation(true);
        setTimeout(() => {
          setShowCompletionAnimation(false);
        }, 3000);
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Failed to update song status:", error);
    }
  }, [
    data.song_id,
    currentSongData.status,
    currentSongData.id,
    currentSongData.song_id,
    supabaseClient,
    isCompleted,
  ]);

  // Supabaseのリアルタイム更新を監視
  useEffect(() => {
    if (isCompleted) return;

    const channel = supabaseClient
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "suno_songs",
          filter: `song_id=eq.${data.song_id}`,
        },
        (payload: RealtimePostgresChangesPayload<SunoSong>) => {
          const updatedSong = payload.new as SunoSong;
          if (
            "id" in updatedSong &&
            "song_id" in updatedSong &&
            "user_id" in updatedSong &&
            "title" in updatedSong &&
            "status" in updatedSong
          ) {
            setCurrentSongData(updatedSong);

            if (updatedSong.status === "complete" && !isCompleted) {
              setShowCompletionAnimation(true);
              setTimeout(() => {
                setShowCompletionAnimation(false);
              }, 3000);
              setIsCompleted(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [data.song_id, isCompleted, supabaseClient]);

  // 定期的なステータス確認
  useEffect(() => {
    if (isCompleted) return;

    // 初回確認
    updateSongStatus();

    // 30秒ごとに確認
    const interval = setInterval(updateSongStatus, 30000);
    return () => clearInterval(interval);
  }, [isCompleted, updateSongStatus]);

  const handleDelete = async () => {
    try {
      await supabaseClient
        .from("suno_songs")
        .delete()
        .eq("song_id", data.song_id);

      setIsDeleteAlertOpen(false);
      router.refresh();
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

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleteAlertOpen && !isPreviewModalOpen) {
      onClick(data.id);
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = useCallback(() => {
    setIsPreviewModalOpen(false);
  }, []);

  const handleDownload = useCallback(
    async (type: "audio" | "video") => {
      if (type === "audio" && currentSongData.audio_url) {
        const filename = `${currentSongData.title || "Untitled"}.mp3`;
        await downloadFile(currentSongData.audio_url, filename);
      } else if (type === "video" && currentSongData.video_url) {
        const filename = `${currentSongData.title || "Untitled"}.mp4`;
        await downloadFile(currentSongData.video_url, filename);
      }
    },
    [
      currentSongData.audio_url,
      currentSongData.video_url,
      currentSongData.title,
    ]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div
      className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3"
      onClick={handleItemClick}
    >
      {/* Dropdown Menu */}
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
            {(currentSongData.audio_url || currentSongData.video_url) && (
              <DropdownMenuItem onClick={handleDownloadClick}>
                <Download className="mr-2 h-4 w-4" />
                ダウンロード
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

      {/* Delete Alert Dialog */}
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
              「{currentSongData.title || "Untitled"}
              」を削除してもよろしいですか？
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

      {/* Preview & Download Modal */}
      <PreviewDownloadModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
        title={currentSongData.title || ""}
        audioUrl={currentSongData.audio_url}
        videoUrl={currentSongData.video_url}
        onDownload={handleDownload}
      />

      {/* Song Image and Model Name */}
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}
        <Image
          className={`object-cover w-full h-full transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={currentSongData.image_url || "/images/wait.jpg"}
          fill
          alt={currentSongData.title}
          onLoad={() => setIsImageLoaded(true)}
        />
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
          {currentSongData.model_name}
        </div>

        {/* Generating Status Overlay */}
        {currentSongData.status !== "complete" && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity duration-500">
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

        {/* Completion Animation Overlay */}
        {showCompletionAnimation && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-500">
            <div className="bg-white/10 rounded-full p-8 backdrop-blur-md">
              <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
            </div>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <div className="text-white text-lg font-semibold animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                Generation Complete!
              </div>
              <div className="text-green-200 text-sm animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                Your song is ready to play
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Song Information */}
      <div className="flex flex-col items-start justify-between w-full pt-4 gap-y-1">
        <Link
          href={`/suno-songs/${currentSongData.song_id}`}
          className="w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-semibold truncate w-full hover:underline">
            {currentSongData.title || "Untitled"}
          </p>
        </Link>

        <div className="flex items-center justify-between w-full mt-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <CiMusicNote1 className="mr-1" />
              {currentSongData.type || "Generated"}
            </div>
          </div>
          <div>{formatDate(currentSongData.created_at)}</div>
        </div>

        {/* Status Badge */}
        {currentSongData.status && (
          <div
            className={`
              absolute top-2 left-2 px-2 py-1 rounded-full text-xs
              transition-all duration-300 transform
              ${
                currentSongData.status === "complete"
                  ? "bg-green-500 text-white scale-0 opacity-0"
                  : currentSongData.status === "gen"
                  ? "bg-blue-500/80 text-white animate-pulse scale-100 opacity-100"
                  : "bg-blue-500 text-white scale-100 opacity-100"
              }
            `}
          >
            {currentSongData.status}
          </div>
        )}
      </div>
    </div>
  );
};

export default SunoSongItem;
