"use client";
import React, { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { useUser } from "@/hooks/auth/useUser";

interface DeleteButtonProps {
  songId: string;
  songPath: string;
  imagePath: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  songId,
  songPath,
  imagePath,
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
      onClick={handleDelete}
      className="hover:opacity-75 transition"
      disabled={isLoading}
    >
      <AiOutlineDelete color="red" size={25} />
    </button>
  );
};

export default DeleteButton;
