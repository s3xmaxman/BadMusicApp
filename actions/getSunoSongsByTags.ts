import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { SunoSong } from "@/types";

/**
 * タグでAI生成曲を検索する
 * @param {string | string[]} tags 検索するタグ（カンマ区切り文字列または配列）
 * @returns {Promise<SunoSong[]>} 検索結果のAI生成曲配列
 */
const getSunoSongsByTags = async (
  tags: string | string[]
): Promise<SunoSong[]> => {
  // タグが文字列の場合は、カンマで分割して配列に変換
  const tagsArray =
    typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;

  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // データベースからSunoSongを検索
  const { data, error } = await supabase
    .from("suno_songs")
    .select("*")
    .or(tagsArray.map((tag) => `tags.ilike.%${tag}%`).join(","))
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as SunoSong[]) || [];
};

export default getSunoSongsByTags;
