"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Image from "next/image";

import { Song } from "@/types";
import { sanitizeTitle } from "@/libs/helpers";
import Modal from "./Modal";
import Input from "../Input";
import { Textarea } from "../ui/textarea";
import GenreSelect from "../GenreSelect";
import Button from "../Button";
import uploadFileToR2 from "@/actions/uploadFileToR2";
import deleteFileFromR2 from "@/actions/deleteFileFromR2";

interface EditFormValues extends Partial<Song> {
  video?: FileList;
  song?: FileList;
  image?: FileList;
}

interface EditModalProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
}

const EditModal = ({ song, isOpen, onClose }: EditModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const supabaseClient = useSupabaseClient();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<EditFormValues>({
      defaultValues: {
        id: song.id,
        user_id: song.user_id,
        title: song.title,
        author: song.author,
        lyrics: song.lyrics,
        image_path: song.image_path,
        video_path: song.video_path || "",
        song_path: song.song_path,
        genre: song.genre || "All",
      },
    });

  const watchVideo = watch("video");
  const watchSong = watch("song");
  const watchImage = watch("image");

  useEffect(() => {
    if (isOpen) {
      reset({
        id: song.id,
        user_id: song.user_id,
        title: song.title,
        author: song.author,
        lyrics: song.lyrics,
        image_path: song.image_path,
        song_path: song.song_path,
        genre: song.genre || "All",
        video_path: song.video_path || "",
        video: undefined,
        song: undefined,
        image: undefined,
      });
      setSelectedGenres(song.genre ? song.genre.split(", ") : []);
    }
  }, [isOpen, song, reset]);

  const handleFileUpload = async ({
    file,
    bucketName,
    fileType,
    fileNamePrefix,
  }: {
    file: File;
    bucketName: "video" | "song" | "image";
    fileType: "video" | "audio" | "image";
    fileNamePrefix: string;
  }) => {
    try {
      const uploadedUrl = await uploadFileToR2({
        file,
        bucketName,
        fileType,
        fileNamePrefix,
      });

      if (!uploadedUrl) {
        toast.error(
          `${
            fileType === "video" ? "動画" : fileType === "audio" ? "曲" : "画像"
          }のアップロードに失敗しました`
        );
        return null;
      }

      // 古いファイルを削除
      if (bucketName === "song" && song.song_path) {
        await deleteFileFromR2({
          bucketName: "song",
          filePath: song.song_path.split("/").pop()!,
          showToast: false,
        });
      } else if (bucketName === "image" && song.image_path) {
        await deleteFileFromR2({
          bucketName: "image",
          filePath: song.image_path.split("/").pop()!,
          showToast: false,
        });
      }

      return uploadedUrl;
    } catch (error) {
      console.error(`${fileType} upload error:`, error);
      return null;
    }
  };

  const onSubmit: SubmitHandler<EditFormValues> = async (values) => {
    try {
      setIsLoading(true);

      let updatedVideoPath = song.video_path;
      let updatedSongPath = song.song_path;
      let updatedImagePath = song.image_path;

      if (values.video?.[0]) {
        const videoPath = await handleFileUpload({
          file: values.video[0],
          bucketName: "video",
          fileType: "video",
          fileNamePrefix: `video-${sanitizeTitle(values.title!)}`,
        });
        if (videoPath) updatedVideoPath = videoPath;
      }

      if (values.song?.[0]) {
        const songPath = await handleFileUpload({
          file: values.song[0],
          bucketName: "song",
          fileType: "audio",
          fileNamePrefix: `song-${sanitizeTitle(values.title!)}`,
        });
        if (songPath) updatedSongPath = songPath;
      }

      if (values.image?.[0]) {
        const imagePath = await handleFileUpload({
          file: values.image[0],
          bucketName: "image",
          fileType: "image",
          fileNamePrefix: `image-${sanitizeTitle(values.title!)}`,
        });
        if (imagePath) updatedImagePath = imagePath;
      }

      const { error } = await supabaseClient
        .from("songs")
        .update({
          title: values.title,
          author: values.author,
          lyrics: values.lyrics,
          genre: selectedGenres.join(", "),
          video_path: updatedVideoPath,
          song_path: updatedSongPath,
          image_path: updatedImagePath,
        })
        .eq("id", song.id);

      if (error) throw error;

      toast.success("曲を編集しました");
      onClose();
    } catch (error) {
      toast.error("編集に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="曲を編集"
      description="曲の情報を編集します。"
      isOpen={isOpen}
      onChange={() => onClose()}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="曲のタイトル"
        />
        <Input
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="曲の作者"
        />
        <Textarea
          disabled={isLoading}
          {...register("lyrics")}
          placeholder="歌詞"
          className="bg-neutral-700"
        />
        <GenreSelect
          onGenreChange={(genres: string) => setSelectedGenres([genres])}
        />

        <div>
          <div className="pb-1">曲を選択（50MB以下）</div>
          <Input
            disabled={isLoading}
            type="file"
            accept="audio/*"
            {...register("song")}
          />
          {song.song_path && (
            <div className="mt-2">
              <audio controls className="w-full mt-2">
                <source src={song.song_path} type="audio/mpeg" />
              </audio>
            </div>
          )}
        </div>

        <div>
          <div className="pb-1">画像を選択（5MB以下）</div>
          <Input
            disabled={isLoading}
            type="file"
            accept="image/*"
            {...register("image")}
          />
          {song.image_path && (
            <div className="mt-2 relative w-32 h-32">
              <Image
                src={song.image_path}
                alt="現在の画像"
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <div>
          <div className="pb-1">ビデオを選択（5MB以下）</div>
          <Input
            disabled={isLoading}
            type="file"
            accept="video/*"
            {...register("video")}
          />
          {song.video_path && (
            <div className="mt-2">
              <a
                href={song.video_path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                既存のビデオを確認
              </a>
            </div>
          )}
        </div>

        <Button disabled={isLoading} type="submit">
          {isLoading ? "編集中..." : "編集"}
        </Button>
      </form>
    </Modal>
  );
};

export default EditModal;
