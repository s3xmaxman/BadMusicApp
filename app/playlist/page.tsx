import Header from "@/components/Header";
import getPlaylists from "@/actions/getPlaylists";
import PlaylistContent from "./components/PlaylistContent";
import getPlaylistSongs from "@/actions/getPlaylistSongs";

export const revalidate = 0;

const Playlist = async () => {
  const playlists = await getPlaylists();

  const playlistsWithSongs = await Promise.all(
    playlists.map(async (playlist) => {
      const songs = await getPlaylistSongs(playlist.id);
      return { ...playlist, songs };
    })
  );

  console.log(playlistsWithSongs);
  return (
    <div className=" bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">プレイリスト</h1>
        </div>
      </Header>
      <PlaylistContent playlists={playlistsWithSongs} />
    </div>
  );
};

export default Playlist;
