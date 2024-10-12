"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import GenreSelect from "./GenreSelect";
import { Song } from "@/types";
import { Textarea } from "./ui/textarea";
import { sanitizeTitle } from "@/libs/helpers";

// TODO: 後でリファクタリングするかもしれない

interface EditFormValues extends Partial<Song> {
  video?: FileList;
}

interface EditModalProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
}

const EditModal = ({ song, isOpen, onClose }: EditModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    song.genre ? song.genre.split(", ") : []
  );
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
      });
      setSelectedGenres(song.genre ? song.genre.split(", ") : []);
    }
  }, [isOpen, song, reset]);

  const handleGenreChange = (genre: string[]) => {
    setSelectedGenres(genre);
  };

  const handleVideoUpload = async (videoFile: File): Promise<string | null> => {
    const maxVideoSize = 5 * 1024 * 1024; // 5MB

    if (videoFile.size > maxVideoSize) {
      toast.error("動画のサイズが5MBを超えています");
      return null;
    }

    try {
      const { data, error } = await supabaseClient.storage
        .from("videos")
        .upload(`video-${sanitizeTitle(videoFile.name)}`, videoFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Video upload error:", error);
        toast.error("ビデオのアップロードに失敗しました");
        return null;
      }

      return data.path;
    } catch (error) {
      console.error("Unexpected error during video upload:", error);
      toast.error("ビデオのアップロード中に不具合が発生しました");
      return null;
    }
  };

  const onSubmit: SubmitHandler<EditFormValues> = async (values) => {
    try {
      setIsLoading(true);

      let updatedVideoPath = song.video_path;

      if (values.video && values.video.length > 0) {
        const videoFile = values.video[0];
        const videoPath = await handleVideoUpload(videoFile);

        if (!videoPath) {
          setIsLoading(false);
          return;
        }

        updatedVideoPath = videoPath;
      }

      const { error } = await supabaseClient
        .from("songs")
        .update({
          title: values.title,
          author: values.author,
          lyrics: values.lyrics,
          genre: selectedGenres.join(", "),
          video_path: updatedVideoPath,
        })
        .eq("id", song.id);

      if (error) {
        toast.error("曲の更新に失敗しました");
        console.error("Supabase update error:", error);
        return;
      }

      toast.success("曲を編集しました");
      onClose();
    } catch (error) {
      toast.error("曲の編集に失敗しました");
      console.error("Unexpected error during update:", error);
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
          className="w-full bg-neutral-700"
          onGenreChange={handleGenreChange}
          defaultValue={selectedGenres}
        />
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
                href={`${
                  supabaseClient.storage
                    .from("videos")
                    .getPublicUrl(song.video_path).data.publicUrl
                }`}
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
