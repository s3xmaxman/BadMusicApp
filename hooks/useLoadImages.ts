// hooks/useLoadImages.ts
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Song } from "@/types";
import { useEffect, useState } from "react";

const useLoadImages = (songs: Song[]) => {
  const supabaseClient = useSupabaseClient();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls = await Promise.all(
        songs.map(async (song) => {
          if (!song.image_path) return null;

          const { data: imageData } = await supabaseClient.storage
            .from("images")
            .getPublicUrl(song.image_path);

          return imageData.publicUrl;
        })
      );
      setImageUrls(urls.filter((url) => url !== null) as string[]);
    };

    fetchImageUrls();
  }, [songs, supabaseClient]);

  return imageUrls;
};

export default useLoadImages;
