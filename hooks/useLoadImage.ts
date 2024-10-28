import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useMemo } from "react";
import { Song, Playlist, SunoSong } from "@/types";

type ImageData = Song | SunoSong | Playlist | null;

const useLoadImage = (data: ImageData) => {
  const supabaseClient = useSupabaseClient();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      setImageUrl(null);
      return;
    }

    const loadImage = async () => {
      if ("image_url" in data) {
        setImageUrl(data.image_url || null);
        return;
      }

      const imagePath = "image_path" in data ? data.image_path : null;

      if (!imagePath) {
        setImageUrl(null);
        return;
      }

      try {
        const { data: imageData } = await supabaseClient.storage
          .from("images")
          .getPublicUrl(imagePath);

        setImageUrl(imageData?.publicUrl || null);
      } catch (error) {
        console.log(error);
        setImageUrl(null);
      }
    };

    loadImage();
  }, [data, supabaseClient]);

  return useMemo(() => imageUrl, [imageUrl]);
};

export default useLoadImage;
