"use client";
import { Song } from "@/types";
import dayjs from "dayjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

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
  const [trends, setTrends] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      setIsLoading(true);
      setError(null);

      try {
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

        setTrends((data as Song[]) || []);
      } catch (err) {
        setError("トレンドデータの取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, [period]);

  return { trends, isLoading, error };
};

export default useGetTrendSongs;
