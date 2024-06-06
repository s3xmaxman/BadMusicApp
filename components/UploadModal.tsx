"use client";

import uniqid from "uniqid";
import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import GenreSelect from "./GenreSelect";
import { sanitizeTitle } from "@/libs/helpers";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");

  const uploadModal = useUploadModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields");
        return;
      }

      const uniqueID = uniqid();

      // Upload song
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${sanitizeTitle(values.title)}-${uniqueID}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        return toast.error("Failed song upload");
      }

      // Upload image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(
            `image-${sanitizeTitle(values.title)}-${uniqueID}`,
            imageFile,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );

      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed image upload");
      }

      // Create record
      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path,
          genre: selectedGenre === "All" ? null : selectedGenre,
        });

      if (supabaseError) {
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("曲をアップロードしました");
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("不具合が発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="曲をアップロード"
      description="mp3ファイルを選択してください"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song author"
        />

        <GenreSelect className="w-full" onGenreChange={handleGenreChange} />

        <div>
          <div className="pb-1">曲を選択</div>
          <Input
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept=".mp3"
            id="song"
            {...register("song", { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">画像を選択</div>
          <Input
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register("image", { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          作成
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
