import { useState, useEffect } from "react";
import { Song, SunoSong } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { manageCacheSize } from "@/libs/helpers";

const CACHE_NAME = "audio-cache";
const CACHE_EXPIRATION = 30 * 24 * 60 * 60 * 1000;

const useLoadSongUrl = (song: Song | SunoSong | undefined, isSuno: boolean) => {
  const supabaseClient = useSupabaseClient();
  const [songUrl, setSongUrl] = useState<string>("");

  useEffect(() => {
    if (!song) {
      setSongUrl("");
      return;
    }

    const loadSong = async () => {
      let url: string;

      if (isSuno) {
        url = (song as SunoSong).audio_url;
      } else {
        const { data: songData } = supabaseClient.storage
          .from("songs")
          .getPublicUrl((song as Song).song_path);

        if (!songData || !songData.publicUrl) {
          console.error("曲のパブリックURLの取得に失敗しました");
          return;
        }
        url = songData.publicUrl;
      }

      try {
        if ("caches" in window) {
          const cache = await caches.open(CACHE_NAME);
          let response = await cache.match(url);

          if (!response) {
            response = await fetch(url);
            const clonedResponse = response.clone();
            await manageCacheSize(cache);

            const headers = new Headers(clonedResponse.headers);
            headers.set("x-cache-date", new Date().toISOString());
            const responseToCache = new Response(await clonedResponse.blob(), {
              headers: headers,
            });
            await cache.put(url, responseToCache);
          } else {
            const cacheDate = new Date(
              response.headers.get("x-cache-date") || ""
            );
            if (Date.now() - cacheDate.getTime() > CACHE_EXPIRATION) {
              response = await fetch(url);
              const clonedResponse = response.clone();
              await cache.put(url, clonedResponse);
            }
          }

          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setSongUrl(objectUrl);
        } else {
          setSongUrl(url);
        }
      } catch (error) {
        console.error("曲の読み込み中にエラーが発生しました:", error);
        setSongUrl(url);
      }
    };

    loadSong();

    return () => {
      if (songUrl.startsWith("blob:")) {
        URL.revokeObjectURL(songUrl);
      }
    };
  }, [song, supabaseClient, isSuno]);

  return songUrl;
};

export default useLoadSongUrl;
