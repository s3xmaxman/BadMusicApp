"use client";

import { twMerge } from "tailwind-merge";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        `
        rounded-xl
        bg-neutral-900/40
        backdrop-blur-xl
        border
        border-white/[0.02]
        shadow-inner
        transition-all
        duration-500
        hover:shadow-lg
        hover:shadow-purple-500/[0.03]
        hover:border-purple-500/[0.05]
        `,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
