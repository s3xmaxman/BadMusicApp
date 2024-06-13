import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getTrendSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("count", { ascending: false })
    .limit(3);

  if (error) {
    console.log(error.message);
    return [];
  }

  return (data as any) || [];
};

export default getTrendSongs;
