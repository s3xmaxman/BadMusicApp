import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useMemo } from "react";
import { Song, Playlist, SunoSong } from "@/types";

type ImageData = Song | SunoSong | Playlist | null;

/**
 * 画像データを読み込むカスタムフック
 *
 * @param {ImageData} data - 画像データを含むオブジェクト
 * @returns {string|null} 読み込まれた画像のURL
 */
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

      if (
        data.image_path?.startsWith("http://") ||
        data.image_path?.startsWith("https://")
      ) {
        setImageUrl(data?.image_path);
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
