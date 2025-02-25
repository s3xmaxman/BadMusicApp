import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CACHE_CONFIG, CACHED_QUERIES } from "@/constants";

/**
 * 指定されたIDに基づいて曲を取得するカスタムフック
 *
 * @param {string|undefined} id - 取得する曲のID
 * @returns {Object} 曲の取得状態と結果
 * @property {boolean} isLoading - データ取得中かどうか
 * @property {Song|undefined} song - 取得した曲データ
 */
const useGetSongById = (id?: string) => {
  const { supabaseClient } = useSessionContext();

  const {
    isLoading,
    data: song,
    error,
  } = useQuery({
    queryKey: [CACHED_QUERIES.songById, id],
    queryFn: async () => {
      if (!id) {
        return undefined;
      }

      const { data, error } = await supabaseClient
        .from("songs")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to load song: ${error.message}`);
      }

      return data as Song | undefined;
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
    enabled: !!id, // id が undefined の場合はクエリを実行しない
  });

  // useQuery の外でエラーハンドリングを行う
  if (error) {
    toast.error(error.message);
  }

  return { isLoading, song };
};

export default useGetSongById;
