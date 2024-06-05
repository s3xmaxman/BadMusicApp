import Header from "@/components/Header";
import getPlaylists from "@/actions/getPlaylists";
import PlaylistContent from "./components/PlaylistContent";

export const revalidate = 0;

const Playlist = async () => {
  const playlists = await getPlaylists();
  return (
    <div className=" bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">プレイリスト</h1>
        </div>
      </Header>
      <PlaylistContent playlists={playlists} />
    </div>
  );
};

export default Playlist;
