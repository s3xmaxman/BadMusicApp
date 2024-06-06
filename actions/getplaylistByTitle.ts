import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";

import { Playlist } from "@/types";

import getPlaylists from "./getPlaylists";

export const getPlaylistByTitle = async (
  title: string
): Promise<Playlist[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  if (!title) {
    const allPlaylists = await getPlaylists();
    return allPlaylists;
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getPlaylistByTitle;
