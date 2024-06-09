import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

const useGetSongsByGenre = (genre: string, excludeId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);

      let query = supabaseClient
        .from("songs")
        .select("*")
        .ilike("genre", `%${genre}%`)
        .limit(3);

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
      } else {
        setSongs(data || []);
      }

      setIsLoading(false);
    };

    fetchSongs();
  }, [genre, excludeId, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      songs,
    }),
    [isLoading, songs]
  );
};

export default useGetSongsByGenre;
