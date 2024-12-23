import { Song, SunoSong } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      setSong(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("songs")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        setIsLoading(false);
        setSong(undefined);
        return toast.error(`Failed to load song: ${error.message}`);
      }

      setSong(data);
      setIsLoading(false);
    };

    fetchSong();
  }, [id, supabaseClient]);

  return useMemo(() => ({ isLoading, song }), [isLoading, song]);
};

export default useGetSongById;
