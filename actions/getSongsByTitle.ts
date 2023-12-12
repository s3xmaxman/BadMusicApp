import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";

import { Song } from "@/types";

import getSongs from "./getSongs";


const getSongsByTitle = async (title: string): Promise<Song[]> => {
    // supabaseクライアントを初期化
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    // タイトルが空の場合は全曲を返す
    if(!title) {
        const allSongs = await getSongs();
        return allSongs;
    }

    // 'songs'テーブルからタイトルに一致する曲を検索
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .ilike('title', `%${title}%`) // タイトルで部分一致検索（大文字小文字区別なし）
        .order('created_at', { ascending: false }); // 作成日時で降順ソート

    // エラー発生時はコンソールに出力
    if(error) {
        console.log(error.message);
    }

    // 曲データまたは空の配列を返す
    return (data as any) || [];
}

export default getSongsByTitle