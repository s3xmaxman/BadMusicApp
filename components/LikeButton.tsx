/**
 * LikeButtonコンポーネントは、ユーザーが曲に「いいね」を付けるためのボタンを提供します。
 * ユーザーがログインしている場合、「いいね」の状態をトグルし、そうでない場合はログインモーダルを表示します。
 *
 * @param {string} songId - いいねを付ける曲のID
 * @param {number} [size] - アイコンのサイズ（デフォルトは25）
 */

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  songId: string;
  size?: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId, size }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const authModal = useAuthModal();

  const [isLiked, setIsLiked] = useState(false);
  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  useEffect(() => {
    /**
     * ユーザーがログインしていない場合、何もしない
     */
    if (!user?.id) {
      return;
    }

    setIsLiked(false);

    /**
     * ユーザーが曲にいいねを付けているかどうかをチェックする
     */
    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [songId, user?.id, supabaseClient]);

  /**
   * いいねボタンがクリックされたときの処理
   */
  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
        updateLikeCount(songId, -1);
      }
    } else {
      const { error } = await supabaseClient.from("liked_songs").insert({
        song_id: songId,
        user_id: user.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success("いいねしました！");
        updateLikeCount(songId, 1);
      }
    }

    router.refresh();
  };

  /**
   * 曲のいいね数を更新する
   * @param {string} songId - 曲のID
   * @param {number} increment - いいね数の増減値
   */
  const updateLikeCount = async (songId: string, increment: number) => {
    const { data, error } = await supabaseClient
      .from("songs")
      .select("like_count")
      .eq("id", songId)
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    const newLikeCount = (data?.like_count || 0) + increment;

    const { error: updateError } = await supabaseClient
      .from("songs")
      .update({ like_count: newLikeCount })
      .eq("id", songId);

    if (updateError) {
      toast.error(updateError.message);
    }
  };

  return (
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color={isLiked ? "#4c1d95" : "white"} size={size || 25} />
    </button>
  );
};

export default LikeButton;
