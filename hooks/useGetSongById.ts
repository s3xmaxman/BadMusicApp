import { Song, SunoSong } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const useGetSongById = (id?: string, isSuno?: boolean) => {
  const [isLoading, setIsLoading] = useState(true);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const [sunoSong, setSunoSong] = useState<SunoSong | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const fetchSong = async () => {
      const tableName = isSuno ? "suno_songs" : "songs";
      console.log("Fetching song with:", {
        tableName,
        id,
        isSuno,
      });

      const { data, error } = await supabaseClient
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single();

      console.log("Fetch result:", {
        data,
        error,
      });

      if (error) {
        setIsLoading(false);
        return toast.error(`useGetSongById: ${error.message}`);
      }

      // 取得した曲データをセットし、ローディングを終了
      isSuno ? setSunoSong(data) : setSong(data);
      setIsLoading(false);
    };

    fetchSong();
  }, [id, isSuno, supabaseClient]);

  // isLoadingとsongが変わるたびに再計算されるuseMemoフック
  return useMemo(
    () => ({ isLoading, song, sunoSong }),
    [isLoading, song, sunoSong]
  );
};

export default useGetSongById;
