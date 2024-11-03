import React, { useState, useEffect, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Playlist } from "@/types";
import { RiPlayListAddFill, RiPlayListFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { useSessionContext } from "@supabase/auth-helpers-react";
import useGetSongById from "@/hooks/useGetSongById";
import useGetSunoSongById from "@/hooks/useGetSunoSongById";

interface PlaylistMenuProps {
  playlists: Playlist[];
  songId: string;
  songType: "regular" | "suno";
  children?: React.ReactNode;
}

type PlaylistSongData = {
  playlist_id: string;
  user_id: string;
  song_type: "regular" | "suno";
  song_id?: string;
  suno_song_id?: string;
};

/**
 * プレイリストに曲を追加するドロップダウンメニューコンポーネント
 *
 * @param playlists プレイリストの配列
 * @param songId 曲のID
 * @param songType 曲のタイプ ("regular" か "suno")
 * @param children ドロップダウンのトリガーとなる要素
 */
const AddPlaylist: React.FC<PlaylistMenuProps> = ({
  playlists,
  songId,
  songType = "regular",
  children,
}) => {
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const authModal = useAuthModal();
  const { song } = useGetSongById(songId);
  const { sunoSong } = useGetSunoSongById(songId);

  const [isAdded, setIsAdded] = useState<Record<string, boolean>>({});

  /**
   * プレイリストに曲が追加済みかどうかを取得し、状態を更新する
   */
  const fetchAddedSongs = useCallback(async () => {
    if (!user?.id) {
      setIsAdded({});
      return;
    }

    try {
      const column = songType === "regular" ? "song_id" : "suno_song_id";
      const { data, error } = await supabaseClient
        .from("playlist_songs")
        .select("playlist_id")
        .eq(column, songId)
        .eq("user_id", user.id)
        .eq("song_type", songType);

      if (error) {
        console.error("プレイリストに追加済みの曲の取得エラー:", error);
        return;
      }

      const addedStatus: Record<string, boolean> = {};

      playlists.forEach((playlist) => {
        // プレイリストがユーザー所有の場合のみ追加済みを判定
        if (playlist.user_id !== user.id) {
          addedStatus[playlist.id] = false;
          return;
        }
        addedStatus[playlist.id] = data.some(
          (item) => item.playlist_id === playlist.id
        );
      });

      setIsAdded(addedStatus);
    } catch (error) {
      console.error("プレイリストの追加状況取得中にエラーが発生:", error);
    }
  }, [user?.id, songId, songType, supabaseClient, playlists]);

  useEffect(() => {
    fetchAddedSongs();
  }, [fetchAddedSongs]);

  /**
   * プレイリストに曲を追加するハンドラー
   *
   * @param playlistId 追加先のプレイリストID
   */
  const handleAddToPlaylist = async (playlistId: string) => {
    if (!user) {
      authModal.onOpen();
      return;
    }

    if (isAdded[playlistId]) {
      toast.error("既にプレイリストに追加されています。");
      return;
    }

    const playlistSongData: PlaylistSongData = {
      playlist_id: playlistId,
      user_id: user.id,
      song_type: songType,
      ...(songType === "suno" ? { suno_song_id: songId } : { song_id: songId }),
    };

    try {
      const { error } = await supabaseClient
        .from("playlist_songs")
        .insert(playlistSongData);

      if (error) {
        console.error("プレイリストへの曲追加エラー:", error);
        toast.error("プレイリストに曲を追加できませんでした。");
        return;
      }

      setIsAdded((prev) => ({ ...prev, [playlistId]: true }));
      toast.success("プレイリストに曲を追加しました。");

      // プレイリストの画像を更新する必要があるか確認
      const needsImageUpdate =
        (songType === "regular" && song?.image_path) ||
        (songType === "suno" && sunoSong?.image_url);

      if (needsImageUpdate) {
        const imagePath = song?.image_path || sunoSong?.image_url;
        const { error: updateError } = await supabaseClient
          .from("playlists")
          .update({ image_path: imagePath })
          .eq("id", playlistId);

        if (updateError) {
          console.error("プレイリスト画像の更新エラー:", updateError);
        }
      }
    } catch (error) {
      console.error("プレイリスト追加中に予期せぬエラーが発生:", error);
      toast.error("予期せぬエラーが発生しました。");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {children || <RiPlayListAddFill size={20} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {playlists.map((playlist) => (
          <DropdownMenuItem
            key={playlist.id}
            onClick={() => handleAddToPlaylist(playlist.id)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <RiPlayListFill size={15} className="mr-1" />
              <span>{playlist.title}</span>
            </div>
            {isAdded[playlist.id] && <span className="ml-2">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddPlaylist;
