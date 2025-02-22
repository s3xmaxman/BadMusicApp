"use client";

import { FaPlay } from "react-icons/fa";

interface PlayButtonProps {
  size?: number;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  size = 35
}) => {
  return (
    <button
      className="
        transition-all
        duration-300
        rounded-full
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-purple-500
        to-purple-600
        p-4
        drop-shadow-md
        hover:scale-110
        hover:shadow-lg
        hover:shadow-purple-500/20
        group
        relative
      "
    >
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
      <FaPlay
        className="text-black relative ml-1"
        size={size / 2}
      />
    </button>
  );
};

export default PlayButton;
