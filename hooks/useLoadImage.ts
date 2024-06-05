import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Song } from "@/types";
import { Playlist } from "@/types";

const useLoadImage = (data: Song | Playlist) => {
  const supabaseClient = useSupabaseClient();

  if (!data) {
    return null;
  }

  // Song と Playlist で image_path の有無を判定
  const imagePath = "image_path" in data ? data.image_path : null;

  if (!imagePath) {
    return null;
  }

  const { data: imageData } = supabaseClient.storage
    .from("images")
    .getPublicUrl(imagePath);

  return imageData.publicUrl;
};

export default useLoadImage;
