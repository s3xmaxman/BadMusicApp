"use client";

import uniqid from "uniqid";
import React, { useState, useRef, useEffect, DragEvent } from "react";
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
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioDropRef = useRef<HTMLDivElement>(null);
  const imageDropRef = useRef<HTMLDivElement>(null);

  const uploadModal = useUploadModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<FieldValues>({
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

  const handleAudioDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingAudio(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      setValue("song", [file]);
      setAudioPreview(URL.createObjectURL(file));
    } else {
      toast.error("音声ファイルをアップロードしてください");
    }
  };

  const handleImageDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImage(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setValue("image", [file]);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("画像ファイルをアップロードしてください");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="title" className="text-sm text-zinc-400">
                タイトル
              </label>
              <Input
                id="title"
                disabled={isLoading}
                {...register("title", { required: true })}
                placeholder="曲のタイトル"
                className="h-9 bg-zinc-800/50 border-zinc-700/50 focus:border-white/30"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="author" className="text-sm text-zinc-400">
                アーティスト
              </label>
              <Input
                id="author"
                disabled={isLoading}
                {...register("author", { required: true })}
                placeholder="アーティスト名"
                className="h-9 bg-zinc-800/50 border-zinc-700/50 focus:border-white/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="lyrics" className="text-sm text-zinc-400">
              歌詞
            </label>
            <Textarea
              id="lyrics"
              disabled={isLoading}
              {...register("lyrics")}
              placeholder="歌詞"
              className="bg-zinc-800/50 border-zinc-700/50 focus:border-white/30 h-28 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-zinc-400">ジャンル</label>
            <GenreSelect
              className="w-full bg-zinc-800/50 border-zinc-700/50"
              onGenreChange={handleGenreChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-zinc-400">曲を選択</label>
            <div
              ref={audioDropRef}
              onDragOver={handleDragOver}
              onDragEnter={() => setIsDraggingAudio(true)}
              onDragLeave={() => setIsDraggingAudio(false)}
              onDrop={handleAudioDrop}
              className={`relative p-3 border-2 border-dashed rounded-lg transition-colors ${
                isDraggingAudio
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-700/50 bg-zinc-800/50"
              }`}
            >
              <Input
                type="file"
                accept=".mp3"
                id="song"
                disabled={isLoading}
                {...register("song", { required: true })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center py-2">
                <p className="text-sm text-zinc-400">
                  クリックまたはドラッグ&ドロップ
                </p>
                <p className="text-xs text-zinc-500">MP3形式のみ</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-zinc-400">画像を選択</label>
            <div
              ref={imageDropRef}
              onDragOver={handleDragOver}
              onDragEnter={() => setIsDraggingImage(true)}
              onDragLeave={() => setIsDraggingImage(false)}
              onDrop={handleImageDrop}
              className={`relative p-3 border-2 border-dashed rounded-lg transition-colors ${
                isDraggingImage
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-700/50 bg-zinc-800/50"
              }`}
            >
              <Input
                type="file"
                accept="image/*"
                id="image"
                disabled={isLoading}
                {...register("image", { required: true })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center py-2">
                <p className="text-sm text-zinc-400">
                  クリックまたはドラッグ&ドロップ
                </p>
                <p className="text-xs text-zinc-500">PNG, JPG</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {imagePreview && (
              <div className="aspect-square relative overflow-hidden rounded-lg border border-zinc-700/50">
                <Image
                  src={imagePreview}
                  alt="アップロードされた画像のプレビュー"
                  className="object-cover"
                  fill
                />
              </div>
            )}
            {audioPreview && (
              <div className="flex items-center p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <audio ref={audioRef} controls className="w-full h-8">
                  <source src={audioPreview} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>
        </div>

        <Button
          disabled={isLoading}
          type="submit"
          className="col-span-full py-3 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
        >
          {isLoading ? "アップロード中..." : "アップロード"}
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
