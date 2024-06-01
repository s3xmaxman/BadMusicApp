"use client";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const authModal = useAuthModal();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    // データを取得する関数を定義
    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      // エラーがなくデータが存在する場合、isLikedをtrueに設定する
      if (!error && data) {
        setIsLiked(true);
      }
    };

    // fetchData関数を呼び出す
    fetchData();
  }, [songId, user?.id, supabaseClient]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    // ユーザーがログインしていない場合、認証モーダルを開く
    if (!user) {
      return authModal.onOpen();
    }

    // 既にいいねされている場合、'liked_songs'テーブルからエントリーを削除する
    if (isLiked) {
      const { error } = await supabaseClient
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      // エラーがある場合はエラーメッセージを表示する
      if (error) {
        toast.error(error.message);
      } else {
        // 削除が成功した場合、isLikedをfalseに設定する
        setIsLiked(false);
      }
    } else {
      // いいねされていない場合、'liked_songs'テーブルに新しいエントリーを挿入する
      const { error } = await supabaseClient.from("liked_songs").insert({
        song_id: songId,
        user_id: user.id,
      });

      // エラーがある場合はエラーメッセージを表示する
      if (error) {
        toast.error(error.message);
      } else {
        // 挿入が成功した場合、isLikedをtrueに設定し、成功メッセージを表示する
        setIsLiked(true);
        toast.success("いいねしました！");
      }
    }

    router.refresh();
  };

  return (
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
