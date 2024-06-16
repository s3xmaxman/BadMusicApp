import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { Song, Playlist } from "@/types";

const useLoadImage = (data: Song | Playlist | null) => {
  const supabaseClient = useSupabaseClient();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      setImageUrl(null);
      return;
    }

    const loadImage = async () => {
      const imagePath = "image_path" in data ? data.image_path : null;

      if (!imagePath) {
        setImageUrl(null);
        return;
      }

      const { data: imageData } = await supabaseClient.storage
        .from("images")
        .getPublicUrl(imagePath);

      setImageUrl(imageData?.publicUrl || null);
    };

    loadImage();
  }, [data, supabaseClient]);

  return imageUrl;
};

export default useLoadImage;
