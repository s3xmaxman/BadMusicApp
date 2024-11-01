import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";
import getSunoSongs from "./getSunoSongs";
import { Song, SunoSong } from "@/types";

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
    // 通常の曲を検索
    supabase
      .from("songs")
      .select("*")
      .ilike("title", `%${title}%`)
      .order("created_at", { ascending: false }),

    // AI生成曲を検索
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
