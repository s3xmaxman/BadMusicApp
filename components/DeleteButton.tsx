"use client";
import React, { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HiTrash } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { useUser } from "@/hooks/auth/useUser";

interface DeleteButtonProps {
  songId: string;
  songPath: string;
  imagePath: string;
  className?: string;
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  songId,
  songPath,
  imagePath,
  className,
  onClick
}) => {
  const { supabaseClient } = useSessionContext();
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (!user?.id) {
        return;
      }

      const { error: songDeleteError } = await supabaseClient.storage
        .from("songs")
        .remove([songPath]);

      if (songDeleteError) {
        console.error(
          "Failed to delete song from storage:",
          songDeleteError.message
        );
        throw new Error(
          "Failed to delete song from storage: " + songDeleteError.message
        );
      }

      const { error: imageDeleteError } = await supabaseClient.storage
        .from("images")
        .remove([imagePath]);

      if (imageDeleteError) {
        console.error(
          "Failed to delete image from storage:",
          imageDeleteError.message
        );
        throw new Error(
          "Failed to delete image from storage: " + imageDeleteError.message
        );
      }

      const { data, error: dbDeleteError } = await supabaseClient
        .from("songs")
        .delete()
        .eq("user_id", user.id)
        .eq("id", parseInt(songId, 10))
        .select("*");

      if (dbDeleteError) {
        console.error(
          "Failed to delete record from database:",
          dbDeleteError.message
        );
        throw new Error(
          "Failed to delete record from database: " + dbDeleteError.message
        );
      }

      if (data.length === 0) {
        console.error(
          "No record was deleted from database. Please check the songId:",
          songId
        );
        throw new Error(
          "No record was deleted from database. Please check the songId."
        );
      }

      toast.success("削除しました");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={twMerge(`
        group
        relative
        rounded-full
        p-2
        hover:bg-red-500/10
        transition-all
        duration-300
        focus:outline-none
      `,
        className
      )}
      onClick={handleDelete}
      disabled={isLoading}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/10 to-red-900/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      <HiTrash 
        className="text-neutral-400 group-hover:text-red-500 transition-colors duration-300 transform group-hover:scale-110" 
        size={20}
      />
    </button>
  );
};

export default DeleteButton;
