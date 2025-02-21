import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useMemo } from "react";

type MediaType = "image" | "video";
type MediaData = {
  image_path?: string;
  video_path?: string;
} | null;

interface UseLoadMediaOptions {
  type: MediaType;
  bucket: string;
}

const useLoadMedia = (
  data: MediaData | MediaData[],
  { type, bucket }: UseLoadMediaOptions
): (string | null)[] => {
  const supabaseClient = useSupabaseClient();
  const [urls, setUrls] = useState<(string | null)[]>([]);

  const isExternalUrl = (path?: string) =>
    path?.startsWith("http://") || path?.startsWith("https://");

  const getMediaPath = (item: MediaData) => {
    if (!item) return null;
    return type === "image" ? item?.image_path : item?.video_path;
  };

  const loadSingleMedia = async (item: MediaData) => {
    const path = getMediaPath(item);
    if (!path) return null;

    if (isExternalUrl(path)) return path;

    try {
      const { data: mediaData } = await supabaseClient.storage
        .from(bucket)
        .getPublicUrl(path);

      return mediaData?.publicUrl || null;
    } catch (error) {
      console.error(`Error loading ${type} for path ${path}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadMedia = async () => {
      if (!data) {
        setUrls([]);
        return;
      }

      const items = Array.isArray(data) ? data : [data];

      try {
        const loadedUrls = await Promise.all(
          items.map((item) => loadSingleMedia(item))
        );
        setUrls(loadedUrls);
      } catch (error) {
        console.error(`Error loading ${type}s:`, error);
        setUrls(items.map(() => null));
      }
    };

    loadMedia();
  }, [data, supabaseClient, type, bucket]);

  return useMemo(() => urls, [urls]);
};

export default useLoadMedia;
