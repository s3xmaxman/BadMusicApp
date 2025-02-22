"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";

interface ListItemProps {
  image: string;
  name: string;
  href: string;
}

const ListItem: React.FC<ListItemProps> = ({ image, name, href }) => {
  const router = useRouter();

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className="
        relative 
        flex 
        items-center 
        rounded-xl 
        overflow-hidden 
        gap-x-4 
        bg-neutral-900/60
        hover:bg-neutral-800/50
        backdrop-blur-sm
        transition-all
        duration-300
        animate-scale-in
        border
        border-white/[0.02]
        hover:border-purple-500/20
        hover:shadow-lg
        hover:shadow-purple-500/[0.03]
        pr-4
      "
    >
      <div className="relative min-h-[64px] min-w-[64px] transition-transform duration-300">
        <Image className="object-cover" src={image} fill alt="Image" />
      </div>
      <p className="font-medium truncate py-5 text-gradient">{name}</p>
      <div
        className="
          absolute 
          opacity-0
          rounded-full
          flex
          items-center
          justify-center
          bg-purple-500
          p-3
          drop-shadow-md
          right-5
        "
      >
        <FaPlay className="text-black" size={12} />
      </div>
    </button>
  );
};

export default ListItem;
