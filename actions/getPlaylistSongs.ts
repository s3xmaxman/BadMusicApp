import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type PlaylistSong = Song & { songType: "regular" };

/**
 * 指定されたプレイリストIDに含まれる曲を取得する
 * @param {string} playlistId プレイリストID
 * @returns {Promise<PlaylistSong[]>} プレイリストに含まれる曲の配列
 */
const getPlaylistSongs = async (
  playlistId: string
): Promise<PlaylistSong[]> => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    console.error("User not authenticated");
    return [];
  }

  const { data, error } = await supabase
    .from("playlist_songs")
    .select("*, songs(*)")
    .eq("playlist_id", playlistId)
    .eq("user_id", session.user.id)
    .eq("song_type", "regular")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching playlist songs:", error);
    return [];
  }

  return (data || []).map((item) => ({
    ...item.songs,
    songType: "regular",
  }));
};

export default getPlaylistSongs;
