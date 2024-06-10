"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import GenreSelect from "./GenreSelect";
import { Song } from "@/types";
import { Textarea } from "./ui/textarea";

interface EditModalProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
}

const EditModal = ({ song, isOpen, onClose }: EditModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>(
    song.genre || "All"
  );
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset, setValue } = useForm<Song>({
    defaultValues: {
      id: undefined,
      user_id: undefined,
      author: "",
      title: "",
      lyrics: "",
      image_path: "",
      song_path: "",
      genre: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setValue("id", song.id);
      setValue("user_id", song.user_id);
      setValue("title", song.title);
      setValue("author", song.author);
      setValue("lyrics", song.lyrics);
      setValue("image_path", song.image_path);
      setValue("song_path", song.song_path);
      setValue("genre", song.genre || "All");
      setSelectedGenre(song.genre || "All");
    }
  }, [isOpen, song, setValue]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const onSubmit: SubmitHandler<Song> = async (values) => {
    try {
      setIsLoading(true);

      // Update song info in Supabase
      const { error } = await supabaseClient
        .from("songs")
        .update({
          title: values.title,
          author: values.author,
          lyrics: values.lyrics,
          genre: selectedGenre === "All" ? null : selectedGenre,
        })
        .eq("id", song.id);

      if (error) {
        toast.error("Failed to update song");
        console.error(error);
        return;
      }

      toast.success("曲を編集しました");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("曲の編集に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="曲を編集"
      description="Edit song information"
      isOpen={isOpen}
      onChange={() => onClose()}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />
        <Input
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song author"
        />
        <Textarea
          disabled={isLoading}
          {...register("lyrics")}
          placeholder="Lyrics"
          className="text-neutral-400  bg-neutral-700"
        />
        <GenreSelect
          className="w-full bg-neutral-700"
          onGenreChange={handleGenreChange}
          defaultValue={selectedGenre}
        />
        <Button disabled={isLoading} type="submit">
          Update
        </Button>
      </form>
    </Modal>
  );
};

export default EditModal;
