"use client"

import qs from "query-string"

import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Input from "./Input";

const SearchInput = () => {
    const router = useRouter();
    const [ value, setValue ] = useState('');
    const debounceValue = useDebounce(value, 500);

    useEffect(() => { 
        // デバウンスされた値をクエリパラメータとして設定 
        const query = { 
            title: debounceValue 
        } 
        // クエリパラメータを含んだURLを作成 
        const url = qs.stringifyUrl({ 
            url: '/search', 
            query: query 
        }) 
        // URLに遷移 
        router.push(url) 
    }, [debounceValue, router]) 



  return (
    <Input
      placeholder="何を聴きたいですか?"
      value={value}
      onChange={(e) => setValue(e.target.value)} 
    />
  )
}

export default SearchInput