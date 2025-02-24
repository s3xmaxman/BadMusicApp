"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { FaUserAlt } from "react-icons/fa";
import { useUser } from "@/hooks/auth/useUser";
import useAuthModal from "@/hooks/auth/useAuthModal";
import Button from "./Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const authModal = useAuthModal();

  return (
    <div
      className={twMerge(
        `
        relative
        h-fit 
        bg-gradient-to-b 
        from-purple-900/10
        via-neutral-900/95
        to-neutral-900/90
        backdrop-blur-xl      
        `,
        className
      )}
    >
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-x-2 md:gap-x-4"></div>
          <div className="flex items-center gap-x-2 md:gap-x-4">
            <div className="flex justify-between items-center gap-x-4"></div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;
