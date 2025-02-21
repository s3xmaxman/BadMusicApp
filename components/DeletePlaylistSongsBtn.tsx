"use client";

import React, { useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DeletePlaylistSongsBtnProps {
  songId: string;
  playlistId: string;
  songType: "regular";
  showText?: boolean;
}

const DeletePlaylistSongsBtn: React.FC<DeletePlaylistSongsBtnProps> = ({
  songId,
  playlistId,
  songType,
  showText = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeletePlaylistSongs = async () => {
    setIsDeleting(true);

    const supabase = createClientComponentClient();

    // 現在のユーザーセッションを取得
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.error("User not authenticated.");
      setIsDeleting(false);
      return;
    }

    try {
      // playlist_songs からデータを削除
      await supabase
        .from("playlist_songs")
        .delete()
        .eq("playlist_id", playlistId)
        .eq("user_id", session.user.id)
        .eq("song_id", songId);

      toast.success("プレイリストから曲が削除されました！");
      router.refresh();
    } catch (error: any) {
      toast.error("Error deleting playlist songs:", error);
      // エラー処理
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      className="flex items-center"
      disabled={isDeleting}
      onClick={handleDeletePlaylistSongs}
    >
      <RiDeleteBin5Line
        className="text-neutral-400 hover:text-red-500 cursor-pointer"
        size={28}
      />
      {showText && <span className="ml-2 text-sm font-semibold">削除</span>}
    </button>
  );
};

export default DeletePlaylistSongsBtn;
