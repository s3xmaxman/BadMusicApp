import { Song, SunoSong } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type SongType = "regular" | "suno";

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

  // テーブル名を取得
  const likedTableName =
    songType === "regular" ? "liked_songs_regular" : "liked_songs_suno";
  const songsTableName = songType === "regular" ? "songs" : "suno_songs";

  // いいねされた曲を取得
  const { data, error } = await supabase
    .from(likedTableName)
    .select(`*, ${songsTableName}(*)`) // 関連する曲の情報も含めて取得
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
    ...item[songsTableName],
    songType, // どちらのテーブルから取得したかを識別するために追加
  }));
};

// 両方のテーブルから全ての「いいね」した曲を取得する関数
const getAllLikedSongs = async (): Promise<Song[]> => {
  const regularSongs = await getLikedSongs("regular");
  const sunoSongs = await getLikedSongs("suno");

  // 両方の結果を結合して作成日時で降順ソート
  return [...regularSongs, ...sunoSongs].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

export default getLikedSongs;
export { getAllLikedSongs };
