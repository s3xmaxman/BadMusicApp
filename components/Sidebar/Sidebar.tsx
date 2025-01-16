"use client";

import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box from "../Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";
import { Playlist, Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { RiPlayListFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";
import { useUser } from "@/hooks/useUser";
import { Button } from "../ui/button";
import Image from "next/image";
import { GoSidebarCollapse } from "react-icons/go";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
  playlists: Playlist[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, songs, playlists }) => {
  const pathname = usePathname();
  const player = usePlayer();
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "ホーム",
        active: pathname === "/",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "検索",
        active: pathname === "/search",
        href: "/search",
      },
      ...(user
        ? [
            {
              icon: RiPlayListFill,
              label: "プレイリスト",
              active: pathname === "/playlists",
              href: "/playlists",
            },
            {
              icon: FaHeart,
              label: "お気に入り",
              active: pathname === "/liked",
              href: "/liked",
            },
          ]
        : []),
    ],
    [pathname, user]
  );

  return (
    <div
      className={twMerge(
        `flex h-full`,
        player.activeId && "h-[calc(100%-80px)]"
      )}
    >
      <div
        className={twMerge(
          "flex flex-col gap-y-2 bg-black h-full p-2 transition-width duration-300",
          isCollapsed ? "w-20" : "w-72",
          "hidden md:flex"
        )}
      >
        <div className="flex items-center justify-between">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={isCollapsed ? 32 : 48}
            height={isCollapsed ? 32 : 48}
            className="mr-auto ml-[15px] cursor-pointer"
            onClick={() => isCollapsed && setIsCollapsed(!isCollapsed)}
          />
          {!isCollapsed && <h1 className="font-bold text-xl">BadMusicApp</h1>}
          <Button
            className="text-white text-2xl mt-1 ml-auto"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? "" : <GoSidebarCollapse size={20} />}
          </Button>
        </div>
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto flex-1 custom-scrollbar">
          <Library
            songs={songs}
            playlists={playlists}
            isCollapsed={isCollapsed}
          />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
    </div>
  );
};

export default Sidebar;
