"use client"
import { Database } from "@/types_db"
import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"

interface SupabaseProviderProps {
    children: React.ReactNode
}

// SupabaseProviderコンポーネントの定義
const SupabaseProvider: React.FC<SupabaseProviderProps> = ({children}) => {
    // supabaseClientステートの作成
    const [supabaseClient] = useState(() => createClientComponentClient<Database>());
    
    return (
        // SessionContextProviderでsupabaseClientを提供する
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children}
        </SessionContextProvider>
    )
}

export default SupabaseProvider