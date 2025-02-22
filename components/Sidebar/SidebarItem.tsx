"use client";

import { IconType } from "react-icons";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Hover from "../Hover";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
  isCollapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
  isCollapsed,
}) => {
  if (isCollapsed) {
    return (
      <Hover contentSize="w-24" description={label}>
        <Link
          href={href}
          className={twMerge(
            `relative flex h-auto w-full items-center justify-center rounded-xl p-2 cursor-pointer transition-all duration-500 group`,
            active
              ? "bg-gradient-to-br from-purple-500/20 to-purple-900/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10"
              : "hover:bg-neutral-800/50 hover:border border-white/5 hover:border-purple-500/20 text-neutral-400 hover:text-white"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl" />
          <Icon size={22} className="relative transition-transform duration-300 group-hover:scale-110" />
        </Link>
      </Hover>
    );
  }

  return (
    <Link
      href={href}
      className={twMerge(
        `relative flex h-auto w-full items-center gap-x-4 py-3 px-4 cursor-pointer rounded-xl transition-all duration-500 group`,
        active
          ? "bg-gradient-to-br from-purple-500/20 to-purple-900/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10"
          : "hover:bg-neutral-800/50 hover:border border-white/5 hover:border-purple-500/20 text-neutral-400 hover:text-white"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl" />
      <Icon size={22} className="relative transition-transform duration-300 group-hover:scale-110" />
      <p className="relative truncate text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">{label}</p>
    </Link>
  );
};

export default SidebarItem;
