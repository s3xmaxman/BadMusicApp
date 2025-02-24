"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useUser } from "@/hooks/auth/useUser";
import useAuthModal from "@/hooks/auth/useAuthModal";
import Button from "./Button";
import Image from "next/image";
import {
  User,
  LogOut,
  Menu,
  X,
  Home,
  Music,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { RiPlayListFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";

interface HeaderProps {
  className?: string;
}

const HomeHeader: React.FC<HeaderProps> = ({ className }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user, userDetails } = useUser();
  const supabaseClient = useSupabaseClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut();
      toast.success("ログアウトしました");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました");
    }
  };

  return (
    <div
      className={twMerge(
        `
        fixed 
        top-0 
        z-50 
        w-full 
        h-fit 
        bg-gradient-to-b 
        from-purple-900/10
        via-neutral-900/95
        to-neutral-900/90
        backdrop-blur-xl
        transition-all
        duration-300
        `,
        scrolled ? "shadow-lg shadow-purple-900/10" : "",
        className
      )}
    >
      <div className="w-full px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo and app name */}
          <div className="flex items-center gap-x-2 md:gap-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-900/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <Image
                src="/logo.svg"
                alt="Logo"
                width={36}
                height={36}
                className="relative cursor-pointer transition-all duration-300 hover:scale-105 z-10"
                onClick={() => router.push("/")}
              />
            </div>
            <h1 className="font-bold text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-neutral-400 hidden md:block">
              BadMusicApp
            </h1>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-x-2 md:gap-x-4">
            {user ? (
              <div className="flex items-center gap-x-2 md:gap-x-4">
                {/* Mobile menu toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden rounded-full p-2 hover:bg-neutral-800 transition"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Menu className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* User profile */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-900/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <Link href="/account">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0 shadow-inner group transition-transform duration-300 hover:scale-105">
                      {userDetails?.avatar_url ? (
                        <Image
                          src={userDetails.avatar_url}
                          alt="ユーザーアバター"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                          <User className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Desktop logout button */}
                <div className="hidden md:block">
                  <Button
                    onClick={handleLogout}
                    className="bg-transparent border border-white/10 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800 transition-all duration-300"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
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
                    size="sm"
                  >
                    ログイン
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={authModal.onOpen}
                    className="px-4 md:px-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 transition-all duration-300"
                    size="sm"
                  >
                    新規登録
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden pt-4 pb-2 mt-2 border-t border-white/5 animate-fadeDown">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="flex items-center gap-x-3 text-neutral-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>ホーム</span>
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-x-3 text-neutral-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="w-5 h-5" />
                <span>検索</span>
              </Link>
              <Link
                href="/playlists"
                className="flex items-center gap-x-3 text-neutral-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <RiPlayListFill className="w-5 h-5" />
                <span>プレイリスト</span>
              </Link>
              <Link
                href="/liked"
                className="flex items-center gap-x-3 text-neutral-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHeart className="w-5 h-5" />
                <span>お気に入り</span>
              </Link>
              <Link
                href="/account"
                className="flex items-center gap-x-3 text-neutral-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span>アカウント設定</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-x-3 text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/10 transition text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>ログアウト</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;
