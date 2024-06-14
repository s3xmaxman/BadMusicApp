import { useState, useRef, useCallback } from "react";
import { Song } from "@/types";
import usePlayer from "./usePlayer";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// デバウンス用の関数
// デバウンスは、頻繁に発生するイベントの回数を制御するために使用します。
// func: デバウンスする関数
// wait: デバウンスの待機時間（ミリ秒）
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout); // 前のタイムアウトをクリア
    timeout = setTimeout(() => func(...args), wait); // 新しいタイムアウトを設定
  };
};

// useOnPlay フックは、楽曲再生の処理を担当します。
const useOnPlay = (songs: Song[]) => {
  const player = usePlayer(); // プレイヤーフックを取得
  const supabase = createClientComponentClient(); // Supabase クライアントを取得
  const [lastPlayTime, setLastPlayTime] = useState<number>(0); // 最後に再生した時刻を保持
  const cooldownRef = useRef<boolean>(false); // クールダウン中かどうかを示すフラグ
  const pendingPlayRef = useRef<string | null>(null); // 保留中の再生IDを保持

  // 楽曲を再生するための処理
  const processPlay = async (id: string) => {
    try {
      player.setId(id); // プレイヤーにIDを設定
      player.setIds(songs.map((song) => song.id)); // プレイヤーにすべての曲のIDを設定

      // Supabaseから楽曲の再生回数を取得
      const { data: songData, error: selectError } = await supabase
        .from("songs")
        .select("count")
        .eq("id", id)
        .single();

      if (selectError || !songData) throw selectError; // エラーが発生した場合は例外をスロー

      // 再生回数をインクリメントする
      const { data: incrementedCount, error: incrementError } =
        await supabase.rpc("increment", { x: songData.count });

      if (incrementError) throw incrementError; // エラーが発生した場合は例外をスロー

      // 再生回数を更新する
      const { error: updateError } = await supabase
        .from("songs")
        .update({ count: incrementedCount })
        .eq("id", id);

      if (updateError) throw updateError; // エラーが発生した場合は例外をスロー
    } catch (error) {
      console.error("エラーが発生しました:", error); // エラーをコンソールに出力
    }
  };

  // 再生イベントのハンドラー
  const onPlay = useCallback(
    async (id: string) => {
      const currentTime = Date.now(); // 現在時刻を取得

      if (cooldownRef.current) {
        // クールダウン中ならば再生IDを保留
        pendingPlayRef.current = id;
        return;
      }

      if (currentTime - lastPlayTime < 1000) {
        // 1秒未満で再生しようとした場合も再生IDを保留
        pendingPlayRef.current = id;
        return;
      }

      cooldownRef.current = true; // クールダウンを開始
      setLastPlayTime(currentTime); // 最後の再生時刻を更新

      await processPlay(id); // 再生処理を実行

      // 1秒後にクールダウンを解除し、保留中の再生IDがあれば再生する
      setTimeout(async () => {
        cooldownRef.current = false;
        if (pendingPlayRef.current) {
          const pendingId = pendingPlayRef.current;
          pendingPlayRef.current = null;
          await onPlay(pendingId); // 保留中の再生IDを再生
        }
      }, 1000);
    },
    [lastPlayTime, player, songs, supabase] // 依存関係を指定
  );

  // デバウンスを適用した再生ハンドラーを返す
  return debounce(onPlay, 500);
};

export default useOnPlay;
