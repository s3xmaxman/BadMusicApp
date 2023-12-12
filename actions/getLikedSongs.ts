import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedSongs = async (): Promise<Song[]> => {
    // supabaseクライアントを初期化
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    // 現在のユーザーセッションを取得
    const { data: { session }} = await supabase.auth.getSession();

    // 'liked_songs'テーブルから、現在のユーザーIDに紐づく「いいね」された曲を取得
    const { data } = await supabase
        .from('liked_songs')
        .select('*, songs(*)') // 関連する曲の情報も含めて取得
        .eq('user_id', session?.user.id) // ユーザーIDで絞り込み
        .order('created_at', { ascending: false }); // 作成日時で降順ソート

    // データがなければ空の配列を返す
    if(!data) return [];

    // 取得したデータから曲の情報のみを新しい配列にして返す
    return data.map((item) => ({
        ...item.songs,
    }));
}

export default getLikedSongs
