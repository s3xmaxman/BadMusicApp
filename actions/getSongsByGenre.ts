import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";

import { Song } from "@/types";

const getSongsByGenre = async (genre: string | string[]): Promise<Song[]> => {
  // ジャンルが文字列の場合は、カンマで分割して配列に変換
  const genreArray =
    typeof genre === "string" ? genre.split(",").map((g) => g.trim()) : genre;

  // supabaseクライアントを初期化
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // データベースから曲を検索
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .or(genreArray.map((genre, index) => `genre.ilike.%${genre}%`).join(","))
    .order("created_at", { ascending: false });

  // エラー発生時はコンソールに出力
  if (error) {
    console.log(error.message);
  }

  // 曲データまたは空の配列を返す
  return (data as any) || [];
};

export default getSongsByGenre;
