"use client";
import usePlaylistModal from "@/hooks/modal/usePlaylistModal";
import { useUser } from "@/hooks/auth/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import Input from "../Input";
import Button from "../Button";

const PlaylistModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const playlistModal = usePlaylistModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      title: "",
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      playlistModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      if (!values.title || !user) {
        toast.error("タイトルを入力してください");
        return;
      }

      const { error } = await supabaseClient.from("playlists").insert({
        user_id: user.id,
        title: values.title,
      });

      if (error) {
        toast.error(error.message);
      } else {
        router.refresh();
        toast.success("プレイリストを作成しました");
        reset();
        playlistModal.onClose();
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="プレイリストを作成"
      description="プレイリストのタイトルを入力してください"
      isOpen={playlistModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="プレイリスト名"
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="col-span-full py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
        >
          {isLoading ? "作成中" : "作成"}
        </Button>
      </form>
    </Modal>
  );
};

export default PlaylistModal;
