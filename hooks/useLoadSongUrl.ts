import { useState, useEffect } from "react";
import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { manageCacheSize } from "@/libs/helpers";

/** キャッシュの名前 */
const CACHE_NAME = "audio-cache";
/** キャッシュの有効期限（30日） */
const CACHE_EXPIRATION = 30 * 24 * 60 * 60 * 1000;

/**
 * 曲のURLを読み込み、キャッシュするカスタムフック
 * @param {Song} song - 読み込む曲のオブジェクト
 * @returns {string} 曲のURL（ブロブURLまたは公開URL）
 */
const useLoadSongUrl = (song: Song) => {
  const supabaseClient = useSupabaseClient();
  const [songUrl, setSongUrl] = useState<string>("");

  useEffect(() => {
    if (!song) {
      setSongUrl("");
      return;
    }

    /**
     * 曲を非同期で読み込み、キャッシュする関数
     */
    const loadSong = async () => {
      // Supabaseから曲の公開URLを取得
      const { data: songData } = supabaseClient.storage
        .from("songs")
        .getPublicUrl(song.song_path);

      if (!songData || !songData.publicUrl) {
        console.error("曲のパブリックURLの取得に失敗しました");
        return;
      }

      try {
        if ("caches" in window) {
          const cache = await caches.open(CACHE_NAME);
          let response = await cache.match(songData.publicUrl);

          if (!response) {
            // キャッシュにない場合、曲をフェッチしてキャッシュ
            // console.log("曲をフェッチしてキャッシュします:", song.title);
            response = await fetch(songData.publicUrl);
            const clonedResponse = response.clone();

            // キャッシュサイズの管理
            await manageCacheSize(cache);

            // メタデータを含めてキャッシュに保存
            const headers = new Headers(clonedResponse.headers);
            headers.set("x-cache-date", new Date().toISOString());
            const responseToCache = new Response(await clonedResponse.blob(), {
              headers: headers,
            });
            await cache.put(songData.publicUrl, responseToCache);
          } else {
            // console.log("キャッシュから曲が見つかりました:", song.title);
            // キャッシュの有効期限をチェック
            const cacheDate = new Date(
              response.headers.get("x-cache-date") || ""
            );
            if (Date.now() - cacheDate.getTime() > CACHE_EXPIRATION) {
              // キャッシュが期限切れの場合、再フェッチ
              // console.log(
              //   "キャッシュが期限切れです。再フェッチします:",
              //   song.title
              // );
              response = await fetch(songData.publicUrl);
              const clonedResponse = response.clone();
              await cache.put(songData.publicUrl, clonedResponse);
            }
          }

          // レスポンスからBlobを作成し、URLを生成
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setSongUrl(objectUrl);
        } else {
          // Caches APIをサポートしていないブラウザ用のフォールバック
          setSongUrl(songData.publicUrl);
        }
      } catch (error) {
        console.error("曲の読み込み中にエラーが発生しました:", error);
        setSongUrl(songData.publicUrl);
      }
    };

    loadSong();

    // クリーンアップ関数：BlobURLの解放
    return () => {
      if (songUrl.startsWith("blob:")) {
        URL.revokeObjectURL(songUrl);
      }
    };
  }, [song, supabaseClient]);

  return songUrl;
};

export default useLoadSongUrl;
