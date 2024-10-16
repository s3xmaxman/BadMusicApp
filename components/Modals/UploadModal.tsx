"use client";

import uniqid from "uniqid";
import React, { useState, useRef, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";

import { sanitizeTitle } from "@/libs/helpers";
import Modal from "./Modal";
import Input from "../Input";
import { Textarea } from "../ui/textarea";
import GenreSelect from "../GenreSelect";
import Button from "../Button";

const UploadModal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const uploadModal = useUploadModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

  const { register, handleSubmit, reset, watch } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      lyrics: "",
      song: null,
      image: null,
    },
  });

  const song = watch("song");
  const image = watch("image");

  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);

  useEffect(() => {
    if (song && song.length > 0) {
      const file = song[0];
      setAudioPreview(URL.createObjectURL(file));
    }
  }, [song]);

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setImagePreview(null);
      setAudioPreview(null);
      uploadModal.onClose();
    }
  };

  const handleGenreChange = (genres: string[]) => {
    setSelectedGenres(genres);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("必須フィールドが未入力です");
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
        return toast.error("曲のアップロードに失敗しました");
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
        return toast.error("画像のアップロードに失敗しました");
      }

      // Create record
      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          lyrics: values.lyrics,
          image_path: imageData.path,
          song_path: songData.path,
          genre: selectedGenres.join(", "),
          count: 0,
        });

      if (supabaseError) {
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("曲をアップロードしました");
      reset();
      setImagePreview(null);
      setAudioPreview(null);
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
      description="mp3ファイルを選択してください"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-4">
          <Input
            id="title"
            disabled={isLoading}
            {...register("title", { required: true })}
            placeholder="曲のタイトル"
          />
          <Input
            id="author"
            disabled={isLoading}
            {...register("author", { required: true })}
            placeholder="アーティスト名"
          />
          <Textarea
            id="lyrics"
            disabled={isLoading}
            {...register("lyrics")}
            placeholder="歌詞"
            className="text-neutral-400 bg-neutral-900 h-32"
          />
          <GenreSelect
            className="w-full bg-neutral-900"
            onGenreChange={handleGenreChange}
          />
        </div>
        <div className="space-y-4">
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
          <div className="space-y-4">
            {imagePreview && (
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="アップロードされた画像のプレビュー"
                  className="object-cover"
                  fill
                />
              </div>
            )}
            {audioPreview && (
              <audio ref={audioRef} controls className="w-full">
                <source src={audioPreview} type="audio/mpeg" />
                お使いのブラウザは音声再生をサポートしていません。
              </audio>
            )}
          </div>
        </div>
        <Button disabled={isLoading} type="submit" className="col-span-full">
          アップロード
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
