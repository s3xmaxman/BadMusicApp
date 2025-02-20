import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useMemo } from "react";
import { Song, Playlist } from "@/types";

type VideoData = Song | Playlist | null;

/**
 * 動画のURLを読み込むカスタムフック
 *
 * @param {VideoData} data - 動画データを含むオブジェクト
 * @returns {string|null} 読み込まれた動画のURL
 */
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

  return useMemo(() => videoUrl, [videoUrl]);
};

export default useLoadVideo;
