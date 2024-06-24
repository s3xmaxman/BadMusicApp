/**
 * 指定された期間に基づいてトレンドの曲データを取得するReactカスタムフック。
 *
 * @param {("all" | "month" | "week" | "day")} period - 取得するトレンドデータの期間を指定。デフォルトは"all"。
 * @returns {{ trends: Song[], isLoading: boolean, error: string | null }} - トレンドの曲データ、ローディング状態、エラー情報を含むオブジェクト。
 *
 * 制限事項:
 * - トレンドデータは最大3曲まで取得される。
 * - 期間が指定されていない場合、全期間のデータが取得される。
 * - エラーが発生した場合、エラーメッセージが返される。
 */
"use client";
import { Song } from "@/types";
import dayjs from "dayjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

const useGetTrendSongs = (period: "all" | "month" | "week" | "day" = "all") => {
  // トレンドの曲データを保持するステート
  const [trends, setTrends] = useState<Song[]>([]);
  // ローディング状態を保持するステート
  const [isLoading, setIsLoading] = useState(false);
  // エラー情報を保持するステート
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // トレンドデータを取得する非同期関数
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

        // データを取得し、カウントの降順でソートし、最大3曲まで取得
        const { data, error } = await query
          .order("count", { ascending: false })
          .limit(3);

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
