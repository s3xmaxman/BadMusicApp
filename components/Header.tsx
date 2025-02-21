"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import useAuthModal from "@/hooks/auth/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/auth/useUser";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import usePlayer from "@/hooks/player/usePlayer";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
  logout?: boolean;
}

const Header: React.FC<HeaderProps> = ({ children, className, logout }) => {
  const authModal = useAuthModal();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const player = usePlayer();
  const { user, userDetails } = useUser();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();
    router.refresh();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out");
    }
  };

  return (
    <div className={twMerge(`h-fit p-6`, className)}>
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="md:hidden flex items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={50}
            height={50}
            className="object-contain"
          />
          <h1 className="font-bold text-xl ml-2">BadMusicApp</h1>
        </div>

        <div className="ml-auto flex justify-end items-center gap-x-4">
          {user ? (
            <div className="flex gap-x-4 items-center z-50">
              {logout && (
                <Button onClick={handleLogout} className="bg-white px-6 py-2">
                  Logout
                </Button>
              )}
              <Button
                onClick={() => router.push("/account")}
                className="bg-transparent"
              >
                <Avatar>
                  {userDetails?.avatar_url ? (
                    <AvatarImage src={userDetails.avatar_url} alt="Avatar" />
                  ) : (
                    <AvatarFallback>
                      <FaUserAlt />
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="bg-transparent text-neutral-300 font-medium"
                >
                  SignUp
                </Button>
              </div>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="bg-white px-6 py-2"
                >
                  Login
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
