/**
 * useGetSongsByGenresフックは、指定されたジャンルに基づいて曲を取得するためのカスタムフックです。
 * オプションで、特定のIDを除外することもできます。
 *
 * @param genres - 検索するジャンルの配列。
 * @param excludeId - 除外する曲のID（オプション）。
 * @returns {Object} - 以下のプロパティを持つオブジェクト：
 *   - isLoading: データのロード状態を示すブール値。
 *   - songGenres: 取得された曲の配列。
 */

import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

const useGetSongsByGenres = (genres: string[], excludeId?: string) => {
  // データのロード状態を管理するステート
  const [isLoading, setIsLoading] = useState(true);
  // 取得した曲のデータを管理するステート
  const [songGenres, setSongGenres] = useState<Song[]>([]);
  // Supabaseクライアントを取得
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    // 曲を取得する非同期関数
    const fetchSongs = async () => {
      setIsLoading(true);

      // 曲テーブルからデータを選択するクエリを開始
      let query = supabaseClient.from("songs").select("*");

      // ジャンルが指定されている場合、ジャンルに基づいてフィルタリング
      if (genres.length > 0) {
        query = query.or(
          genres.map((genre) => `genre.ilike.%${genre}%`).join(",")
        );
      }

      // 除外IDが指定されている場合、そのIDを除外
      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      // 取得する曲の数を3つに制限
      query = query.limit(3);

      // クエリを実行し、結果を取得
      const { data, error } = await query;

      // エラーがあればコンソールに出力
      if (error) {
        console.error(error);
      } else {
        // データがあればステートにセット
        setSongGenres(data || []);
      }

      setIsLoading(false);
    };

    fetchSongs();
  }, [genres, excludeId, supabaseClient]);

  // メモ化して返す
  return useMemo(
    () => ({
      isLoading,
      songGenres,
    }),
    [isLoading, songGenres]
  );
};

export default useGetSongsByGenres;
