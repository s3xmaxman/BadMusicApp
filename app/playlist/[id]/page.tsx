"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Playlist } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const PlaylistPage = () => {
  const params = useParams() as { id: string };
  const supabaseClient = useSupabaseClient();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  // useEffectを使ってデータフェッチ
  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (params.id) {
        const { data: playlistData, error } = await supabaseClient
          .from("playlists")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          console.error("Error fetching playlist:", error);
        } else {
          setPlaylist(playlistData);
        }
      }
    };

    fetchPlaylistData();
  }, [params.id, supabaseClient]);

  if (!playlist) {
    return <div>Loading...</div>; // データ取得まで表示
  }

  return (
    <div>
      <h1>{playlist.id}</h1>
    </div>
  );
};

export default PlaylistPage;
