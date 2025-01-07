import { SunoSong } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * ユーザーのAI生成曲を取得する
 * @returns {Promise<SunoSong[]>} AI生成曲の配列
 */
const getSunoSongs = async (): Promise<SunoSong[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("suno_songs")
    .select("*")
    .eq("user_id", session?.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getSunoSongs;
