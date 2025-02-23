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
import { useUser } from "@/hooks/auth/useUser";
import useAuthModal from "@/hooks/auth/useAuthModal";
import { useSessionContext } from "@supabase/auth-helpers-react";
import useGetSongById from "@/hooks/data/useGetSongById";
import usePlaylistModal from "@/hooks/modal/usePlaylistModal";

interface PlaylistMenuProps {
  playlists: Playlist[];
  songId: string;
  songType: "regular";
  children?: React.ReactNode;
}

type PlaylistSongData = {
  playlist_id: string;
  user_id: string;
  song_type: "regular";
  song_id?: string;
};

/**
 * プレイリストに曲を追加するドロップダウンメニューコンポーネント
 *
 * @param playlists プレイリストの配列
 * @param songId 曲のID
 * @param songType 曲のタイプ ("regular")
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
      const { data, error } = await supabaseClient
        .from("playlist_songs")
        .select("playlist_id")
        .eq("song_id", songId)
        .eq("user_id", user.id)
        .eq("song_type", "regular");

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
      song_id: songId,
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
      const needsImageUpdate = songType === "regular" && song?.image_path;

      if (needsImageUpdate) {
        const imagePath = song?.image_path;
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
      <DropdownMenuTrigger className="text-neutral-400 cursor-pointer hover:text-white hover:filter hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">
        {children || <RiPlayListAddFill size={20} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {playlists.length === 0 ? (
          <DropdownMenuItem>プレイリストを作成しましょう！</DropdownMenuItem>
        ) : (
          playlists.map((playlist) => (
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
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddPlaylist;
