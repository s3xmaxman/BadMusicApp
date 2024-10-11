import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { Song, Playlist } from "@/types";

type VideoData = Song | Playlist | null;

const useLoadVideo = (data: VideoData) => {
  const supabaseClient = useSupabaseClient();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      setVideoUrl(null);
      return;
    }

    const loadVideo = async () => {
      const videoPath = "video_path" in data ? data.video_path : null;

      if (!videoPath) {
        setVideoUrl(null);
        return;
      }

      try {
        const { data: videoData } = supabaseClient.storage
          .from("videos")
          .getPublicUrl(videoPath);

        setVideoUrl(videoData?.publicUrl || null);
      } catch (err) {
        console.error("Unexpected error fetching video URL:", err);
        setVideoUrl(null);
      }
    };

    loadVideo();
  }, [data, supabaseClient]);

  return videoUrl;
};

export default useLoadVideo;
