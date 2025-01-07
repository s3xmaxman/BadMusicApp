import { useState, useRef, useCallback } from "react";
import { Song } from "@/types";
import usePlayer from "./usePlayer";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 曲の再生を管理するカスタムフック
 *
 * @param {Song[]} songs - 再生対象の曲リスト
 * @returns {function} 曲を再生する関数
 */
const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const supabase = createClientComponentClient();
  const [lastPlayTime, setLastPlayTime] = useState<number>(0);
  const cooldownRef = useRef<boolean>(false);
  const pendingPlayRef = useRef<string | null>(null);

  const processPlay = async (id: string) => {
    try {
      player.setId(id, false);
      player.setIds(
        songs.map((song) => song.id),
        false
      );

      const { data: songData, error: selectError } = await supabase
        .from("songs")
        .select("count")
        .eq("id", id)
        .single();

      if (selectError || !songData) throw selectError;

      const { data: incrementedCount, error: incrementError } =
        await supabase.rpc("increment", { x: songData.count });

      if (incrementError) throw incrementError;

      const { error: updateError } = await supabase
        .from("songs")
        .update({ count: incrementedCount })
        .eq("id", id);

      if (updateError) throw updateError;
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const onPlay = useCallback(
    async (id: string) => {
      const currentTime = Date.now();

      if (cooldownRef.current) {
        pendingPlayRef.current = id;
        return;
      }

      if (currentTime - lastPlayTime < 1000) {
        pendingPlayRef.current = id;
        return;
      }

      cooldownRef.current = true;
      setLastPlayTime(currentTime);

      player.play();
      await processPlay(id);

      setTimeout(async () => {
        cooldownRef.current = false;
        if (pendingPlayRef.current) {
          const pendingId = pendingPlayRef.current;
          pendingPlayRef.current = null;
          await onPlay(pendingId);
        }
      }, 1000);
    },
    [lastPlayTime, player, songs, supabase]
  );

  return debounce(onPlay, 500);
};

export default useOnPlay;
