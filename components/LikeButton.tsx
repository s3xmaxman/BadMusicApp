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
    const fetchData = async () => {
      if (!user?.id) {
        return;
      }

      setIsLiked(false);

      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .maybeSingle();

      if (error) {
        if (error.code !== "PGRST116") {
          console.error("Error fetching liked songs:", error);
        }
      } else if (data) {
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

    try {
      if (isLiked) {
        // いいねを取り消す
        const { error } = await supabaseClient
          .from("liked_songs")
          .delete()
          .eq("user_id", user.id)
          .eq("song_id", songId);

        if (error) {
          throw error;
        }

        setIsLiked(false);
        await updateLikeCount(songId, -1);
      } else {
        // いいねを追加する
        const { error } = await supabaseClient.from("liked_songs").insert({
          song_id: songId,
          user_id: user.id,
        });

        if (error) {
          throw error;
        }

        setIsLiked(true);
        await updateLikeCount(songId, 1);
        toast.success("いいねしました！");
      }
    } catch (error) {
      toast.error("エラーが発生しました。もう一度お試しください。");
    }
  };

  /**
   * 曲のいいね数を更新する
   * @param {string} songId - 曲のID
   * @param {number} increment - いいね数の増減値
   */
  const updateLikeCount = async (songId: string, increment: number) => {
    try {
      const { data, error } = await supabaseClient
        .from("songs")
        .select("like_count")
        .eq("id", songId)
        .single();

      if (error) {
        throw error;
      }

      const newLikeCount = (data?.like_count || 0) + increment;

      const { error: updateError } = await supabaseClient
        .from("songs")
        .update({ like_count: newLikeCount })
        .eq("id", songId);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      toast.error("エラーが発生しました。もう一度お試しください。");
    }
  };

  return (
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color={isLiked ? "#FF69B4" : "white"} size={size || 25} />
    </button>
  );
};

export default LikeButton;
