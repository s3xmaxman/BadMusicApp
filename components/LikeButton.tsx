import useAuthModal from "@/hooks/auth/useAuthModal";
import { useUser } from "@/hooks/auth/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  songId: string;
  songType: "regular";
  size?: number;
  showText?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  songId,
  songType,
  size,
  showText = false,
}) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const authModal = useAuthModal();
  const [isLiked, setIsLiked] = useState(false);
  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setIsLiked(false);

      const { data, error } = await supabaseClient
        .from("liked_songs_regular")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .maybeSingle();

      if (error) {
        if (error.code !== "PGRST116") {
          console.error("Error fetching liked songs:", error);
          toast.error("いいねの状態の取得に失敗しました");
        }
      } else if (data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [songId, songType, user?.id, supabaseClient]);

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    try {
      if (isLiked) {
        const { error } = await supabaseClient
          .from("liked_songs_regular")
          .delete()
          .eq("user_id", user.id)
          .eq("song_id", songId);

        if (error) throw error;

        setIsLiked(false);
        await updateLikeCount(songId, -1);
      } else {
        const { error } = await supabaseClient
          .from("liked_songs_regular")
          .insert({
            song_id: songId,
            user_id: user.id,
          });

        if (error) throw error;

        setIsLiked(true);
        await updateLikeCount(songId, 1);
        toast.success("いいねしました！");
      }
    } catch (error) {
      toast.error("エラーが発生しました。もう一度お試しください。");
    }
  };

  const updateLikeCount = async (songId: string, increment: number) => {
    try {
      // 現在のlike_countを取得
      const { data, error: fetchError } = await supabaseClient
        .from("songs")
        .select("like_count")
        .eq("id", songId)
        .single();

      if (fetchError) throw fetchError;

      // 新しいlike_countを計算して更新
      const newLikeCount = (data?.like_count || 0) + increment;
      const { error: updateError } = await supabaseClient
        .from("songs")
        .update({ like_count: newLikeCount })
        .eq("id", songId);

      if (updateError) throw updateError;
    } catch (error) {
      toast.error("いいねの更新に失敗しました");
    }
  };

  return (
    <button
      onClick={handleLike}
      className="text-neutral-400 cursor-pointer hover:text-white hover:filter hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"
      aria-label={isLiked ? "Remove like" : "Add like"}
    >
      <div className="flex items-center">
        <Icon color={isLiked ? "#FF69B4" : "white"} size={size || 25} />
        {showText && (
          <span className="ml-2">{isLiked ? "いいね済み" : "いいね"}</span>
        )}
      </div>
    </button>
  );
};

export default LikeButton;
