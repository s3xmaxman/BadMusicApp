import { Song } from "@/types";
import usePlayer from "./usePlayer";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();

  const onPlay = async (id: string) => {
    try {
      player.setId(id);
      player.setIds(songs.map((song) => song.id));

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

  return onPlay;
};

export default useOnPlay;
