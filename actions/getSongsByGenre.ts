import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";

import { Song } from "@/types";

const getSongsByGenre = async (genre: string): Promise<Song[]> => {
  // supabaseクライアントを初期化
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // データベースから曲を取得
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("genre", genre)
    .order("created_at", { ascending: false }); // 作成日時で降順ソート

  // エラー発生時はコンソールに出力
  if (error) {
    console.log(error.message);
  }

  // 曲データまたは空の配列を返す
  return (data as any) || [];
};

export default getSongsByGenre;
