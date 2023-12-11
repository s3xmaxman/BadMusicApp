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
        const query = {
            title: debounceValue
        }

        const url = qs.stringifyUrl({
            url: '/search',
            query: query
        })
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