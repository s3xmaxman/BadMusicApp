import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Playlist } from "@/types";
import { RiPlayListAddFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { RiPlayListFill } from "react-icons/ri";
import { useSessionContext } from "@supabase/auth-helpers-react";
import useGetSongById from "@/hooks/useGetSongById";

interface PlaylistMenuProps {
  playlists: Playlist[];
  songId: string;
  children?: React.ReactNode;
}
/**
 * プレイリストに追加するドロップダウンメニューコンポーネント
 *
 * @param playlists プレイリストの配列
 * @param songId 曲のID
 */
const AddPlaylist: React.FC<PlaylistMenuProps> = ({
  playlists,
  songId,
  children,
}) => {
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  /**
   * プレイリストに曲が追加済みかどうかを保持する状態
   *
   * @type {Record<string, boolean>}
   */
  const [isAdded, setIsAdded] = useState<Record<string, boolean>>({});
  const authModal = useAuthModal();
  const { song } = useGetSongById(songId);

  /**
   * プレイリストに曲が追加済みかどうかを判定する
   *
   * @param songId 曲のID
   * @param playlists プレイリストの配列
   * @param supabaseClient Supabaseクライアント
   * @param userId ユーザーID
   */
  useEffect(() => {
    const fetchAddedSongs = async () => {
      if (!user?.id) {
        return;
      }

      const { data, error } = await supabaseClient
        .from("playlist_songs")
        .select("*")
        .eq("song_id", songId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching added songs:", error);
        return;
      }

      // データから、各プレイリストに曲が追加済みかどうかを判定
      const addedStatus: Record<string, boolean> = {};
      playlists.forEach((playlist) => {
        // ユーザーが作成したプレイリストかつ、データに含まれている場合に追加済みと判定
        addedStatus[playlist.id] =
          playlist.user_id === user.id &&
          data.some((item) => item.playlist_id === playlist.id);
      });
      setIsAdded(addedStatus);
    };

    fetchAddedSongs();
  }, [songId, playlists, supabaseClient, user?.id]);

  /**
   * プレイリストに曲をを追加する
   *
   * @param playlistId プレイリストのID
   */
  const handleAddToPlaylist = async (playlistId: string) => {
    if (!user) {
      console.log("User not found, opening auth modal");
      return authModal.onOpen();
    }

    if (isAdded[playlistId]) {
      toast.error("既にプレイリストに追加されています。");
      return;
    }

    const { data: playlistData, error: playlistError } = await supabaseClient
      .from("playlist_songs")
      .select("*")
      .eq("playlist_id", playlistId);

    if (playlistError) {
      console.error("Error fetching playlist songs:", playlistError);
      return;
    }

    const { error } = await supabaseClient.from("playlist_songs").insert({
      playlist_id: playlistId,
      song_id: songId,
      user_id: user.id,
    });

    if (error) {
      console.error("Error adding song to playlist:", error);
      toast.error("プレイリストに曲を追加できませんでした");
    } else {
      setIsAdded((prev) => ({ ...prev, [playlistId]: true }));
      toast.success("プレイリストに曲を追加しました");

      if (playlistData.length === 0 && song?.image_path) {
        const { error: updateError } = await supabaseClient
          .from("playlists")
          .update({ image_path: song.image_path })
          .eq("id", playlistId);

        if (updateError) {
          console.error("Error updating playlist image:", updateError);
        }
      }
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
          >
            <div className="mr-1">
              <RiPlayListFill size={15} />
            </div>
            {playlist.title}
            {isAdded[playlist.id] && " ✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddPlaylist;
