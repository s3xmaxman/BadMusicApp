import { Song, SunoSong } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type PlaylistSong = (Song | SunoSong) & { songType: "regular" | "suno" };

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

  const [regularSongsResult, sunoSongsResult] = await Promise.all([
    supabase
      .from("playlist_songs")
      .select("*, songs(*)")
      .eq("playlist_id", playlistId)
      .eq("user_id", session.user.id)
      .eq("song_type", "regular")
      .order("created_at", { ascending: false }),

    supabase
      .from("playlist_songs")
      .select("*, suno_songs(*)")
      .eq("playlist_id", playlistId)
      .eq("user_id", session.user.id)
      .eq("song_type", "suno")
      .order("created_at", { ascending: false }),
  ]);

  if (regularSongsResult.error) {
    console.error(
      "Error fetching regular playlist songs:",
      regularSongsResult.error
    );
  }

  if (sunoSongsResult.error) {
    console.error("Error fetching suno playlist songs:", sunoSongsResult.error);
  }

  const regularSongs: PlaylistSong[] = (regularSongsResult.data || []).map(
    (item) => ({
      ...item.songs,
      songType: "regular" as const,
    })
  );

  const sunoSongs: PlaylistSong[] = (sunoSongsResult.data || []).map(
    (item) => ({
      ...item.suno_songs,
      songType: "suno" as const,
    })
  );

  return [...regularSongs, ...sunoSongs].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export default getPlaylistSongs;
