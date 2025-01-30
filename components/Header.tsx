"use client";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import usePlayer from "@/hooks/usePlayer";
import Image from "next/image";

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
  const { user } = useUser();

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
            <div className="flex gap-x-4 items-center">
              {logout && (
                <Button onClick={handleLogout} className="bg-white px-6 py-2">
                  Logout
                </Button>
              )}
              <Button
                onClick={() => router.push("/account")}
                className="bg-white"
              >
                <FaUserAlt />
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
