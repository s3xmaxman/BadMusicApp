import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useMemo } from "react";
import { Song, Playlist, SunoSong } from "@/types";

const useLoadImages = (data: Playlist[] | SunoSong[] | Song[]) => {
  const supabaseClient = useSupabaseClient();
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (!data.length) {
      setImageUrls([]);
      return;
    }

    const fetchImageUrls = async () => {
      try {
        const urls = await Promise.all(
          data.map(async (item) => {
            if ("image_url" in item && item.image_url) {
              return item.image_url;
            }

            if ("image_path" in item && item.image_path) {
              if (
                item.image_path.startsWith("http://") ||
                item.image_path.startsWith("https://")
              ) {
                return item.image_path;
              }

              try {
                const { data: imageData } = await supabaseClient.storage
                  .from("images")
                  .getPublicUrl(item.image_path);

                return imageData?.publicUrl || null;
              } catch (error) {
                console.error(
                  `Error loading image for path ${item.image_path}:`,
                  error
                );
                return null;
              }
            }
            return null;
          })
        );

        setImageUrls(urls);
      } catch (error) {
        console.error("Error loading images:", error);
        setImageUrls(data.map(() => null));
      }
    };

    fetchImageUrls();
  }, [data, supabaseClient]);

  return useMemo(() => imageUrls, [imageUrls]);
};

export default useLoadImages;
