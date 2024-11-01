import { SunoSong } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSunoSongs = async (): Promise<SunoSong[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("suno_songs")
    .select("*")
    .eq("user_id", session?.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getSunoSongs;
