import getPlaylistSongs from "@/actions/getPlaylistSongs";
import PlaylistPageContent from "./components/PlaylistPageContent";
import getPlaylistsImage from "@/actions/getPlaylistsImage";
import { Song, SunoSong } from "@/types";

type CombinedSong = Song & SunoSong & { songType: "regular" | "suno" };

const PlaylistPage = async ({
  params: { id: playlistId },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const playlistTitle = searchParams.title as string;
  const imageUrl = await getPlaylistsImage(playlistId);
  const songs = await getPlaylistSongs(playlistId);

  return (
    <PlaylistPageContent
      playlistId={playlistId}
      playlistTitle={playlistTitle}
      songs={songs as CombinedSong[]}
      imageUrl={imageUrl}
    />
  );
};

export default PlaylistPage;
