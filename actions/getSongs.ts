import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });
    
    // 'songs' テーブルから全てのデータを取得し、作成日時の降順でソートする 
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.log(error.message);
    }
    
     // データが存在しない場合は空の配列を返す 
    return (data as any) || [];
}

export default getSongs