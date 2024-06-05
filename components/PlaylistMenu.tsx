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

interface PlaylistMenuProps {
  playlists: Playlist[];
}

const PlaylistMenu = ({ playlists }: PlaylistMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <RiPlayListAddFill size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Playlist</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {playlists.map((playlist) => (
          <DropdownMenuItem key={playlist.id}>
            {playlist.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlaylistMenu;
