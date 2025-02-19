import { Spotlight } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * @returns Spotlight[]
 * サーバーコンポーネントクライアントを作成し、データベースからスポットライトを取得します。
 * スポットライトは、作成日の降順で並べ替えられます。
 * エラーが発生した場合は、エラーメッセージをコンソールに出力します。
 * @async
 */
const getSpotlight = async (): Promise<Spotlight[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabase
    .from("spotlights")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as Spotlight[]) || [];
};

export default getSpotlight;
