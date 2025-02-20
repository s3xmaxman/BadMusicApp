import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type SongType = "regular";

const getLikedSongs = async (
  songType: SongType = "regular"
): Promise<Song[]> => {
  // supabaseクライアントを初期化
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // 現在のユーザーセッションを取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // いいねされた曲を取得
  const { data, error } = await supabase
    .from("liked_songs_regular")
    .select("*, songs(*)") // 関連する曲の情報も含めて取得
    .eq("user_id", session?.user.id) // ユーザーIDで絞り込み
    .order("created_at", { ascending: false }); // 作成日時で降順ソート

  if (error) {
    console.error("Error fetching liked songs:", error);
    return [];
  }

  // データがなければ空の配列を返す
  if (!data) return [];

  // 取得したデータから曲の情報のみを新しい配列にして返す
  return data.map((item) => ({
    ...item.songs,
    songType, // どちらのテーブルから取得したかを識別するために追加
  }));
};

export default getLikedSongs;
