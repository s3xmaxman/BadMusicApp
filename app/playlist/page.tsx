import Header from "@/components/Header";
import SearchContent from "../search/components/SearchContent";
import SearchInput from "@/components/SearchInput";
import getSongsByTitle from "@/actions/getSongsByTitle";
import getPlaylistByTitle from "@/actions/getplaylistByTitle";
import getPlaylists from "@/actions/getPlaylists";
import PlaylistContent from "./components/PlaylistContent";

export const revalidate = 0;

type SearchParams = {
  title: string;
};

const Playlist = async () => {
  const playlists = await getPlaylists();
  return (
    <div className=" bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">プレイリスト</h1>
          {/* <SearchInput /> */}
        </div>
      </Header>
      <PlaylistContent playlists={playlists} />
    </div>
  );
};

export default Playlist;
