import getSongsByTitle from "@/actions/getSongsByTitle";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";

interface SearchProps {
  searchParams: { title: string };
}

const Search = async ({ searchParams }: SearchProps) => {
  const { songs } = await getSongsByTitle(searchParams.title);

  return (
    <div className=" bg-[#0d0d0d] rounded-lg w-full h-full overflow-hidden overflow-y-auto custom-scrollbar">
      <Header>
        <div className="mb-2 flex flex-col gap-y-6">
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} />
    </div>
  );
};

export default Search;
