import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getPlaylistSongs = async (playlistId: string): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 'playlist_songs'テーブルから、指定されたプレイリストIDに紐づく曲を取得
  const { data, error } = await supabase
    .from("playlist_songs")
    .select("*, songs(*)") // 関連する曲の情報も含めて取得
    .eq("playlist_id", playlistId) // プレイリストIDで絞り込み
    .eq("user_id", session?.user.id) // ユーザーIDで絞り込み
    .order("created_at", { ascending: false }); // 作成日時で降順ソート (任意)

  if (error) {
    console.error("Error fetching playlist songs:", error);
    return [];
  }

  if (!data) return [];

  // 取得したデータから曲の情報のみを新しい配列にして返す
  return data.map((item) => ({
    ...item.songs,
  }));
};

export default getPlaylistSongs;
