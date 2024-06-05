import getPlaylistSongs from "@/actions/getPlaylistSongs";
import PlaylistPageContent from "./components/PlaylistPageContent";

const PlaylistPage = async ({
  params: { id: playlistId },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const playlistTitle = searchParams.title as string;

  const songs = await getPlaylistSongs(playlistId);

  return (
    <PlaylistPageContent
      playlistId={playlistId}
      playlistTitle={playlistTitle}
      songs={songs}
    />
  );
};

export default PlaylistPage;
