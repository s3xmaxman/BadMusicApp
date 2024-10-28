import { useState, useEffect, useMemo } from "react";
import { Song, SunoSong } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadSongUrl = (song: Song | SunoSong | undefined) => {
  const supabaseClient = useSupabaseClient();
  const [songUrl, setSongUrl] = useState<string>("");

  useEffect(() => {
    if (!song) {
      setSongUrl("");
      return;
    }

    const loadSong = async () => {
      if ("audio_url" in song) {
        setSongUrl(song.audio_url);
        return;
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
