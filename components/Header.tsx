"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { useUser } from "@/hooks/auth/useUser";
import useSubscribeModal from "@/hooks/modal/useSubscribeModal";
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
  const supabaseClient = useSupabaseClient();
  const { user, subscription } = useUser();
  const subscribeModal = useSubscribeModal();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("ログアウトしました");
    }
  };

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
        z-10
        `,
        className
      )}
    >
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-x-2 md:gap-x-4"></div>
          <div className="flex items-center gap-x-2 md:gap-x-4">
            <div className="flex items-center gap-x-2 md:gap-x-4">
              <button
                onClick={() => router.push("/")}
                className="group relative rounded-full p-2 hover:bg-neutral-800/50 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <HiHome
                  size={20}
                  className="text-neutral-400 group-hover:text-white transition-colors"
                />
              </button>
              <button
                onClick={() => router.push("/search")}
                className="group relative rounded-full p-2 hover:bg-neutral-800/50 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <BiSearch
                  size={20}
                  className="text-neutral-400 group-hover:text-white transition-colors"
                />
              </button>
            </div>
            <div className="flex justify-between items-center gap-x-4">
              {user ? (
                <div className="flex gap-x-4 items-center">
                  <div className="flex items-center gap-x-4">
                    <Button
                      onClick={() => router.push("/account")}
                      className="bg-white/5 hover:bg-white/10"
                    >
                      <FaUserAlt />
                    </Button>
                    <Button onClick={handleLogout} variant="outline">
                      ログアウト
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <Button
                      onClick={authModal.onOpen}
                      className="bg-transparent text-neutral-300 font-medium hover:text-white"
                    >
                      ログイン
                    </Button>
                  </div>
                  <div>
                    <Button onClick={authModal.onOpen} className="px-6">
                      新規登録
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;
