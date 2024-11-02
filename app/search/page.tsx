import getSongsByTitle from "@/actions/getSongsByTitle";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";

interface SearchProps {
  searchParams: { title: string };
}

export const revalidate = 0;

const Search = async ({ searchParams }: SearchProps) => {
  const { songs, sunoSongs } = await getSongsByTitle(searchParams.title);

  return (
    <div className=" bg-[#0d0d0d] rounded-lg w-full h-full overflow-hidden overflow-y-auto custom-scrollbar">
      <Header>
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">検索</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} sunoSongs={sunoSongs} />
    </div>
  );
};

export default Search;
