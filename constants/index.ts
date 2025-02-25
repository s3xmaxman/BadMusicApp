export const videoIds = [
  { id: 1, name: "synthwave radio", videoId: "4xDzrJKXOOY" },
  { id: 2, name: "lofi hip hop radio", videoId: "jfKfPfyJRdk" },
  { id: 3, name: "dark ambient radio", videoId: "S_MOd40zlYU" },
  { id: 4, name: "Blade Runner Radio", videoId: "RrkrdYm3HPQ" },
  { id: 5, name: "tokyo night drive", videoId: "Lcdi9O2XB4E" },
];

export const CACHE_PREFIX = "@query-cache";

export const CACHED_QUERIES = {
  media: "media",
  songUrl: "songUrl",
  songById: "songById",
} as const;

export const CACHE_CONFIG = {
  staleTime: 1000 * 60 * 30, // 30分間
  gcTime: 1000 * 60 * 60, // 60分間
} as const;
