import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * 指定されたプレイリストIDの画像パスを取得する
 * @param {string} playlistId プレイリストID
 * @returns {Promise<string | null>} 画像パス。取得できない場合はnullを返す
 */
const getPlaylistsImage = async (playlistId: string) => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data: playlistData, error } = await supabase
    .from("playlists")
    .select("image_path")
    .eq("id", playlistId)
    .single();

  if (error) {
    console.error("Error fetching playlist image_path:", error);
    return null;
  }

  return playlistData.image_path;
};

export default getPlaylistsImage;
