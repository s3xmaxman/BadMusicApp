import Header from "@/components/Header";
import getPlaylists from "@/actions/getPlaylists";
import PlaylistContent from "./components/PlaylistContent";

const Playlist = async () => {
  const playlists = await getPlaylists();

  return (
    <div className="bg-[#0d0d0d] rounded-lg w-full h-full overflow-hidden overflow-y-auto custom-scrollbar">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                プレイリスト
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <PlaylistContent playlists={playlists} />
    </div>
  );
};

export default Playlist;
