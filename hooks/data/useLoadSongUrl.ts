import { useState, useEffect, useMemo } from "react";
import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

/**
 * 曲のURLを読み込むカスタムフック
 *
 * @param {Song | undefined} song - 曲データ
 * @returns {string} 読み込まれた曲のURL
 */
const useLoadSongUrl = (song: Song | undefined) => {
  const supabaseClient = useSupabaseClient();
  const [songUrl, setSongUrl] = useState<string>("");

  useEffect(() => {
    if (!song) {
      setSongUrl("");
      return;
    }

    const isExternalUrl = (path?: string) =>
      path?.startsWith("http://") || path?.startsWith("https://");

    const loadSong = async () => {
      if (isExternalUrl(song.song_path)) {
        return setSongUrl(song.song_path);
      }

      try {
        const { data: songData } = await supabaseClient.storage
          .from("songs")
          .getPublicUrl(song.song_path);

        setSongUrl(songData?.publicUrl || "");
      } catch (error) {
        console.error("曲の読み込み中にエラーが発生しました:", error);
        setSongUrl("");
      }
    };

    loadSong();
  }, [song, supabaseClient]);

  return useMemo(() => songUrl, [songUrl]);
};

export default useLoadSongUrl;
