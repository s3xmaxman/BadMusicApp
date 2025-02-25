import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { CACHE_CONFIG, CACHED_QUERIES } from "@/constants";

const useGetSongsByGenres = (genres: string[], excludeId?: string) => {
  const { supabaseClient } = useSessionContext();

  const { data, isLoading, error } = useQuery({
    queryKey: [CACHED_QUERIES.songsByGenres, genres, excludeId],
    queryFn: async () => {
      let query = supabaseClient.from("songs").select("*");

      if (genres.length > 0) {
        query = query.or(
          genres.map((genre) => `genre.ilike.%${genre}%`).join(",")
        );
      }

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      query = query.limit(3);

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to load songs by genres: ${error.message}`);
      }

      return (data || []) as Song[];
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
    enabled: !!genres,
  });

  if (error) {
    console.error(error);
  }

  return {
    isLoading,
    songGenres: data || [],
  };
};

export default useGetSongsByGenres;
