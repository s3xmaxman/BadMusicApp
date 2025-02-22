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
      <Link
        href={href}
        className={twMerge(
          `w-full flex items-center justify-center`,
          active ? "border-purple-500/30" : "border-white/5"
        )}
      >
        <Hover description={label} contentSize="w-auto px-3 py-2" side="right">
          <div className="p-3 rounded-xl">
            <Icon
              size={20}
              className={twMerge(
                active ? "text-purple-400" : "text-neutral-400"
              )}
            />
          </div>
        </Hover>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={twMerge(
        `flex h-auto w-full items-center gap-x-4 py-3.5 px-4 rounded-xl`,
        active
          ? "bg-purple-500/20 text-white border border-purple-500/30"
          : "text-neutral-400 border border-transparent"
      )}>
      <Icon size={24} />
      <p className="truncate text-sm font-medium">{label}</p>
    </Link>
  );
};

export default SidebarItem;
