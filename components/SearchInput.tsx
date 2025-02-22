"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/utils/useDebounce";
import { BiSearch } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";

interface SearchInputProps {
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "タイトル、アーティスト名で検索",
}) => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };

    const url = qs.stringifyUrl({
      url: "/search",
      query,
    });

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="relative w-full group">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-900/10 opacity-0 group-focus-within:opacity-100 transition-all duration-300 -z-10" />
      <div className="relative flex items-center gap-2 w-full rounded-xl bg-neutral-900/60 backdrop-blur-sm border border-white/[0.02] group-hover:border-purple-500/20 group-focus-within:border-purple-500/30 transition-all duration-300 px-4 py-2">
        <BiSearch 
          className="text-neutral-400 group-hover:text-neutral-300 group-focus-within:text-purple-400 transition-colors" 
          size={20} 
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-neutral-200 placeholder:text-neutral-400 focus:outline-none text-sm"
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="p-1 rounded-lg hover:bg-neutral-800/80 transition-colors"
          >
            <IoMdClose 
              className="text-neutral-400 hover:text-white transition-colors" 
              size={16} 
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
