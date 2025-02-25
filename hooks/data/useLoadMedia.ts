import { useQuery, useQueries, UseQueryOptions } from "@tanstack/react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMemo } from "react";
import { CACHE_CONFIG, CACHED_QUERIES } from "@/constants";

type MediaType = "image" | "video";
type MediaData = {
  image_path?: string;
  video_path?: string;
} | null;

interface UseLoadMediaOptions {
  type: MediaType;
  bucket: string;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * A hook to load media from Supabase Storage with TanStack Query caching
 */
const useLoadMedia = (
  data: MediaData | MediaData[],
  {
    type,
    bucket,
    staleTime = CACHE_CONFIG.staleTime,
    cacheTime = CACHE_CONFIG.gcTime,
  }: UseLoadMediaOptions
): (string | null)[] => {
  const supabaseClient = useSupabaseClient();

  const isExternalUrl = (path?: string) =>
    path?.startsWith("http://") || path?.startsWith("https://");

  const getMediaPath = (item: MediaData) => {
    if (!item) return null;
    return type === "image" ? item?.image_path : item?.video_path;
  };

  const fetchMediaUrl = async (item: MediaData): Promise<string | null> => {
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

  // 前処理: dataをいつも配列形式に変換する
  const dataArray = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }, [data]);

  // 各アイテムのパスを取得
  const paths = useMemo(() => {
    return dataArray.map((item) => getMediaPath(item));
  }, [dataArray]);

  // クエリを実行
  const results = useQueries({
    queries: dataArray.map((item, index) => {
      const path = paths[index];
      return {
        queryKey: [CACHED_QUERIES.media, bucket, type, path],
        queryFn: () => fetchMediaUrl(item),
        staleTime,
        gcTime: cacheTime,
        enabled: !!path,
      } as UseQueryOptions<string | null>;
    }),
  });

  return results.map((result) => result.data || null);
};

export default useLoadMedia;
