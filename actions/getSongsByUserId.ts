import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types";

const getSongsByUserId = async (): Promise<Song[]> => {
  // supabaseクライアントを初期化。
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // 現在のセッションを取得。
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  // セッション取得時のエラーをチェック。
  if (sessionError) {
    console.log(sessionError.message);
    return []; // エラーがあれば空の配列を返す。
  }

  // 'songs'テーブルから、ユーザーIDが一致する曲を取得。
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", sessionData.session?.user.id)
    .order("created_at", { ascending: false }); // 作成日時の降順で並べる。

  // 曲の取得時のエラーをチェックします。
  if (error) {
    console.log(error.message);
  }

  return (data as Song[]) || []; // 取得した曲のデータまたは空の配列を返す。
};

export default getSongsByUserId;
