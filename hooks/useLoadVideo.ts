import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useMemo } from "react";
import { Song, Playlist, SunoSong } from "@/types";

type VideoData = Song | SunoSong | Playlist | null;

const useLoadVideo = (data: VideoData) => {
  const supabaseClient = useSupabaseClient();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      setVideoUrl(null);
      return;
    }

    const loadVideo = async () => {
      // SunoSongの場合は直接video_urlを使用
      if ("video_url" in data) {
        setVideoUrl(data.video_url || null);
        return;
      }

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

  return useMemo(() => videoUrl, [videoUrl]);
};

export default useLoadVideo;
