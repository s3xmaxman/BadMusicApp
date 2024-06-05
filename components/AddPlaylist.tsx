import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Playlist } from "@/types";
import { RiPlayListAddFill } from "react-icons/ri";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";

interface PlaylistMenuProps {
  playlists: Playlist[];
  songId: string;
}

const AddPlaylist: React.FC<PlaylistMenuProps> = ({ playlists, songId }) => {
  const supabase = createClientComponentClient();
  const { user } = useUser();
  const [isAdded, setIsAdded] = useState<Record<string, boolean>>({});
  const authModal = useAuthModal();

  useEffect(() => {
    const fetchAddedSongs = async () => {
      if (!user?.id) {
        return;
      }

      const { data, error } = await supabase
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
  }, [songId, playlists, supabase, user?.id]);

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isAdded[playlistId]) {
      // 既に追加済みの場合
      toast.error("既にプレイリストに追加されています。");
      return;
    }

    const { error } = await supabase.from("playlist_songs").insert({
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
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <RiPlayListAddFill size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>プレイリスト</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {playlists.map((playlist) => (
          <DropdownMenuItem
            key={playlist.id}
            onClick={() => handleAddToPlaylist(playlist.id)}
          >
            {playlist.title} {/* プレイリスト名を表示 */}
            {isAdded[playlist.id] && " ✓"}
            {/* 追加済みの場合はチェックマークを表示 */}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddPlaylist;
