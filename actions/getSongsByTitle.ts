import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";
import { Song } from "@/types";

/**
 * タイトルで曲を検索する
 * @param {string} title 検索するタイトル
 * @returns {Promise<{songs: Song[]}>} 通常曲オブジェクト
 */
const getSongsByTitle = async (title: string) => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  if (!title) {
    const songs = await getSongs();
    return {
      songs: songs,
    };
  }

  const songsResult = await supabase
    .from("songs")
    .select("*")
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  return {
    songs: (songsResult.data as Song[]) || [],
  };
};

export default getSongsByTitle;
