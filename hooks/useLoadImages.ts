import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Playlist, Song } from "@/types";
import { useEffect, useState, useMemo } from "react";

const useLoadImages = (data: Song[] | Playlist[]) => {
  const supabaseClient = useSupabaseClient();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls = await Promise.all(
        data.map(async (data) => {
          if (!data.image_path) return "";

          const { data: imageData } = await supabaseClient.storage
            .from("images")
            .getPublicUrl(data.image_path);

          return imageData.publicUrl;
        })
      );
      setImageUrls(urls);
    };

    fetchImageUrls();
  }, [data, supabaseClient]);

  return useMemo(() => imageUrls, [imageUrls]);
};

export default useLoadImages;
