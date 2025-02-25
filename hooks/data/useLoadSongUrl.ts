import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { CACHE_CONFIG, CACHED_QUERIES } from "@/constants";

/**
 * 曲のURLを読み込むカスタムフック
 *
 * @param {Song | undefined} song - 曲データ
 * @param {object} options - オプション
 * @param {number} options.staleTime - キャッシュの有効期限 (ミリ秒)
 * @param {number} options.cacheTime - キャッシュの有効期限 (ミリ秒)
 * @returns {string} 読み込まれた曲のURL
 */
const useLoadSongUrl = (
  song: Song | undefined,
  options = {
    staleTime: CACHE_CONFIG.staleTime,
    cacheTime: CACHE_CONFIG.gcTime,
  }
) => {
  const supabaseClient = useSupabaseClient();

  const isExternalUrl = (path?: string) =>
    path?.startsWith("http://") || path?.startsWith("https://");

  const { data: songUrl } = useQuery({
    queryKey: [CACHED_QUERIES.songUrl, song?.id, song?.song_path],
    queryFn: async (): Promise<string> => {
      if (!song) return "";

      if (isExternalUrl(song.song_path)) {
        return song.song_path;
      }

      try {
        const { data: songData } = await supabaseClient.storage
          .from("songs")
          .getPublicUrl(song.song_path);

        return songData?.publicUrl || "";
      } catch (error) {
        console.error("曲の読み込み中にエラーが発生しました:", error);
        return "";
      }
    },
    staleTime: options.staleTime,
    gcTime: options.cacheTime,
    enabled: !!song,
  });

  return songUrl || "";
};

export default useLoadSongUrl;
