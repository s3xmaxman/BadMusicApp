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
import usePlayer from "@/hooks/player/usePlayer";
import { RiPlayListFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";
import { useUser } from "@/hooks/auth/useUser";
import { Button } from "../ui/button";
import Image from "next/image";
import { GoSidebarCollapse } from "react-icons/go";
import UserCard from "./UserCard";
import Hover from "../Hover";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
  playlists: Playlist[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, songs, playlists }) => {
  const pathname = usePathname();
  const player = usePlayer();
  const { user, userDetails } = useUser();
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
          "flex flex-col gap-y-2.5 bg-gradient-to-br from-black/95 via-neutral-900/90 to-neutral-900/85 h-full p-2.5 transition-all duration-500 backdrop-blur-2xl border-r border-white/[0.02] shadow-xl shadow-black/10",
          isCollapsed ? "w-20" : "w-72",
          "hidden md:flex"
        )}
      >
        <div className="flex items-center justify-between px-2.5 py-2">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-900/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <Hover contentSize="w-24" description="メニューを展開" side="right">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="relative cursor-pointer transition-all duration-300 hover:scale-105 z-10"
                  onClick={() => isCollapsed && setIsCollapsed(!isCollapsed)}
                />
              </Hover>
            </div>
            {!isCollapsed && (
              <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-neutral-400">
                BadMusicApp
              </h1>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? "" : <GoSidebarCollapse size={20} />}
          </Button>
        </div>

        <Box className="bg-neutral-900/40 backdrop-blur-xl border border-white/[0.02] shadow-inner">
          <div className="flex flex-col gap-y-3 px-4 py-3">
            {routes.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </Box>

        <Box className="overflow-y-auto flex-1 custom-scrollbar bg-neutral-900/40 backdrop-blur-xl border border-white/[0.02] shadow-inner">
          <Library isCollapsed={isCollapsed} />
        </Box>

        <div className=" mb-6">
          <UserCard userDetails={userDetails} isCollapsed={isCollapsed} />
        </div>
      </div>
      <main className="h-full flex-1 overflow-y-auto  bg-gradient-to-b from-neutral-900 to-black">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
