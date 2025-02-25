import { Song } from "@/types";
import dayjs from "dayjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";
import { CACHE_CONFIG, CACHED_QUERIES } from "@/constants";

/**
 * 指定された期間に基づいてトレンド曲を取得するカスタムフック
 *
 * @param {"all" | "month" | "week" | "day"} period - 取得する期間
 * @returns {Object} トレンド曲の取得状態と結果
 * @property {Song[]} trends - 取得したトレンド曲のリスト
 * @property {boolean} isLoading - データ取得中かどうか
 * @property {string|null} error - エラーメッセージ
 */
const useGetTrendSongs = (period: "all" | "month" | "week" | "day" = "all") => {
  const {
    data: trends,
    isLoading,
    error,
  } = useQuery({
    queryKey: [CACHED_QUERIES.trendSongs, period],
    queryFn: async () => {
      const supabase = createClientComponentClient();

      let query = supabase.from("songs").select("*");

      // 指定された期間に基づいてデータをフィルタリング
      switch (period) {
        case "month":
          query = query.filter(
            "created_at",
            "gte",
            dayjs().subtract(1, "month").toISOString()
          );
          break;
        case "week":
          query = query.filter(
            "created_at",
            "gte",
            dayjs().subtract(1, "week").toISOString()
          );
          break;
        case "day":
          query = query.filter(
            "created_at",
            "gte",
            dayjs().subtract(1, "day").toISOString()
          );
          break;
        default:
          break;
      }

      // データを取得し、カウントの降順でソートし、最大10曲まで取得
      const { data, error } = await query
        .order("count", { ascending: false })
        .limit(10);

      if (error) {
        throw new Error(error.message);
      }

      return (data as Song[]) || [];
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
  });

  if (error) {
    console.error("トレンドデータの取得に失敗しました。");
  }

  return { trends, isLoading, error };
};

export default useGetTrendSongs;
