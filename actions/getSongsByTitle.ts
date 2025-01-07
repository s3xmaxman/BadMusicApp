import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";
import getSunoSongs from "./getSunoSongs";
import { Song, SunoSong } from "@/types";

/**
 * タイトルで曲を検索する
 * @param {string} title 検索するタイトル
 * @returns {Promise<{songs: Song[], sunoSongs: SunoSong[]}>} 通常曲とAI生成曲のオブジェクト
 */
const getSongsByTitle = async (title: string) => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  if (!title) {
    const regularSongs = await getSongs();
    const aiSongs = await getSunoSongs();
    return {
      songs: regularSongs,
      sunoSongs: aiSongs,
    };
  }

  const [songsResult, sunoSongsResult] = await Promise.all([
    supabase
      .from("songs")
      .select("*")
      .ilike("title", `%${title}%`)
      .order("created_at", { ascending: false }),

    supabase
      .from("suno_songs")
      .select("*")
      .ilike("title", `%${title}%`)
      .order("created_at", { ascending: false }),
  ]);

  return {
    songs: (songsResult.data as Song[]) || [],
    sunoSongs: (sunoSongsResult.data as SunoSong[]) || [],
  };
};

export default getSongsByTitle;
