"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { User, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";

interface UserCardProps {
  userDetails: any;
  isCollapsed: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ userDetails, isCollapsed }) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut();
      toast.success("ログアウトしました");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました");
    }
  };

  if (isCollapsed) {
    return (
      <div className="px-1">
        <button
          onClick={() => router.push("/account")}
          className="w-full aspect-square rounded-xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-lg border border-white/5 hover:border-purple-500/30 transition-all duration-500 relative group overflow-hidden shadow-lg hover:shadow-purple-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          {userDetails?.avatar_url ? (
            <Image
              src={userDetails.avatar_url}
              alt="ユーザーアバター"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors duration-300" />
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <Card
      className="mx-2 overflow-hidden rounded-xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-lg border-white/5 hover:border-purple-500/30 transition-all duration-500 shadow-lg hover:shadow-purple-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 hover:opacity-100 transition-all duration-500" />

        <div className="p-3 relative">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 shadow-inner group transition-transform duration-300 hover:scale-105">
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

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300 truncate">
                {userDetails?.full_name || "ゲスト"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => router.push("/account")}
                className="p-1.5 rounded-lg hover:bg-purple-500/10 transition-colors duration-300"
              >
                <Settings
                  size={16}
                  className="text-neutral-400 hover:text-purple-300 transition-colors"
                />
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-purple-500/10 transition-colors duration-300"
              >
                <LogOut
                  size={16}
                  className="text-neutral-400 hover:text-purple-300 transition-colors"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
