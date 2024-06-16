import getPlaylistSongs from "@/actions/getPlaylistSongs";
import PlaylistPageContent from "./components/PlaylistPageContent";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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
      // imagePath={playlistData.image_path}
    />
  );
};

export default PlaylistPage;
