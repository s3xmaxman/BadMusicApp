import { Song } from "@/types"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"

const useGetSongById = (id?: string) => {
    const [isLoading, setIsLoading] = useState(true)
    const [song , setSong] = useState<Song | undefined>(undefined)
    const { supabaseClient } = useSessionContext()

    // idが変わるたびに実行されるuseEffectフック
    useEffect(() => {
        if(!id) {
            return
        }

        setIsLoading(true)

        const fetchSong = async () => {
            // supabaseから指定されたidの曲を取得
            const { data, error } = await supabaseClient
                .from('songs')
                .select('*')
                .eq('id', id)
                .single()

            // エラーがあった場合はローディングを終了し、トーストでエラーメッセージを表示
            if(error) {
                setIsLoading(false)
                return toast.error(error.message)
            }

            // 取得した曲データをセットし、ローディングを終了
            setSong(data)
            setIsLoading(false)
        }

        // 曲を取得する関数を呼び出し
        fetchSong();
    }, [id, supabaseClient])

    // isLoadingとsongが変わるたびに再計算されるuseMemoフック
    return useMemo(() => ({
        isLoading,
        song
    }), [isLoading, song])  
}

export default useGetSongById

