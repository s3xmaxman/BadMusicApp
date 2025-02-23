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
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

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
        `,
        className
      )}
    >
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-x-2 md:gap-x-4"></div>
          <div className="flex items-center gap-x-2 md:gap-x-4">
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
