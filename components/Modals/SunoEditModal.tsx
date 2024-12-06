"use client";

import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import { SunoSong } from "@/types";
import Modal from "./Modal";
import Input from "../Input";
import { Textarea } from "../ui/textarea";
import Button from "../Button";

interface EditFormValues {
  title: string;
  lyric: string;
}

interface SunoEditModalProps {
  song: SunoSong;
  isOpen: boolean;
  onClose: () => void;
}

const SunoEditModal = ({ song, isOpen, onClose }: SunoEditModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const supabaseClient = useSupabaseClient();

  const { register, handleSubmit, reset } = useForm<EditFormValues>({
    defaultValues: {
      title: song.title,
      lyric: song.lyric,
    },
  });

  const onSubmit: SubmitHandler<EditFormValues> = async (values) => {
    try {
      setIsLoading(true);

      const { error } = await supabaseClient
        .from("suno_songs")
        .update({
          title: values.title,
          lyric: values.lyric,
        })
        .eq("id", song.id);

      if (error) {
        toast.error("更新に失敗しました");
      } else {
        toast.success("更新しました");
        reset();
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Song"
      description="歌詞と題名を編集できます"
      isOpen={isOpen}
      onChange={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="タイトル"
        />
        <Textarea
          id="lyrics"
          disabled={isLoading}
          {...register("lyric", { required: true })}
          placeholder="歌詞"
          className="h-[200px]"
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="col-span-full py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
        >
          {isLoading ? "編集中..." : "編集"}
        </Button>
      </form>
    </Modal>
  );
};

export default SunoEditModal;
