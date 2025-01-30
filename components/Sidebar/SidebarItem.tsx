import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import Hover from "../Hover";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
  isCollapsed,
}) => {
  const linkContent = (
    <Link
      href={href}
      className={twMerge(
        `
          flex 
          flex-row 
          h-auto 
          items-center 
          w-full 
          gap-x-4 
          text-md 
          font-medium
          cursor-pointer
          hover:text-white
          transition
          text-neutral-400
          py-1
        `,
        active && "text-white",
        isCollapsed ? "text-xl" : "text-lg"
      )}
    >
      <Icon size={26} />
      {!isCollapsed && <span className="truncate w-full">{label}</span>}
    </Link>
  );

  return isCollapsed ? (
    <Hover description={label} side="right" isCollapsed={isCollapsed}>
      {linkContent}
    </Hover>
  ) : (
    linkContent
  );
};

export default SidebarItem;
