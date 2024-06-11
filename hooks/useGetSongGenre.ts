import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

const useGetSongsByGenres = (genres: string[], excludeId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [songGenres, setSongGenres] = useState<Song[]>([]);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);

      let query = supabaseClient.from("songs").select("*");

      // Apply genre filters
      if (genres.length > 0) {
        query = query.or(
          genres.map((genre) => `genre.ilike.%${genre}%`).join(",")
        );
      }

      // Exclude a specific song if excludeId is provided
      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      query = query.limit(3);

      const { data, error } = await query;

      if (error) {
        console.error(error);
      } else {
        setSongGenres(data || []);
      }

      setIsLoading(false);
    };

    fetchSongs();
  }, [genres, excludeId, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      songGenres,
    }),
    [isLoading, songGenres]
  );
};

export default useGetSongsByGenres;
