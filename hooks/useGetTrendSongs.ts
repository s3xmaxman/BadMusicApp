import { Song } from "@/types";
import dayjs from "dayjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const useGetTrendSongs = async (
  period: "month" | "week" | "day" | "all" = "all"
): Promise<Song[]> => {
  const supabase = createClientComponentClient();

  let query = supabase.from("songs").select("*");

  switch (period) {
    case "month":
      query = query.filter(
        "created_at",
        "gte",
        dayjs().subtract(1, "month").toISOString()
      );
      break;
    case "week":
      query = query.filter(
        "created_at",
        "gte",
        dayjs().subtract(1, "week").toISOString()
      );
      break;
    case "day":
      query = query.filter(
        "created_at",
        "gte",
        dayjs().subtract(1, "day").toISOString()
      );
      break;
    default:
      break;
  }

  const { data, error } = await query
    .order("count", { ascending: false })
    .limit(3);

  if (error) {
    console.log(error.message);
    return [];
  }
  return (data as any) || [];
};

export default useGetTrendSongs;
