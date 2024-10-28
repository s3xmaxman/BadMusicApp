import { SunoSong } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const useGetSunoSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sunoSong, setSunoSong] = useState<SunoSong | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      setSunoSong(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("suno_songs")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        setIsLoading(false);
        setSunoSong(undefined);
        return toast.error(`Failed to load Suno song: ${error.message}`);
      }

      setSunoSong(data);
      setIsLoading(false);
    };

    fetchSong();
  }, [id, supabaseClient]);

  return useMemo(() => ({ isLoading, sunoSong }), [isLoading, sunoSong]);
};

export default useGetSunoSongById;
