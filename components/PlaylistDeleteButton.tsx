"use client"; // クライアントコンポーネント

import React, { useState } from "react";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

interface PlaylistDeleteButtonProps {
  playlistId: string;
}

const PlaylistDeleteButton: React.FC<PlaylistDeleteButtonProps> = ({
  playlistId,
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePlaylist = async () => {
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
        .eq("user_id", session.user.id);

      // playlists からデータを削除
      await supabase
        .from("playlists")
        .delete()
        .eq("id", playlistId)
        .eq("user_id", session.user.id);

      // 削除後、プレイリスト一覧に遷移するなどの処理を追加
      router.push("/playlist");
      router.refresh();
    } catch (error: any) {
      toast.error("Error deleting playlist:", error);
      // エラー処理
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <MdOutlinePlaylistRemove
        onClick={handleDeletePlaylist} // 削除ボタンクリック時に実行
        className="text-neutral-400 hover:text-red-500 cursor-pointer"
        size={40}
      />
    </div>
  );
};

export default PlaylistDeleteButton;
