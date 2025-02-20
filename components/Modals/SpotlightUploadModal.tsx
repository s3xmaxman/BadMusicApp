import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/auth/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import Modal from "./Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";

import uploadFileToR2 from "@/actions/uploadFileToR2";
import useSpotLightUploadModal from "@/hooks/modal/useSpotLightUpload";
import { Textarea } from "../ui/textarea";

const SpotlightUploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const spotlightUploadModal = useSpotLightUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      video: null,
      title: "",
      author: "",
      genre: "",
      description: "",
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      spotlightUploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      if (!user) {
        toast.error("ログインが必要です");
        return;
      }

      const videoFile = values.video?.[0];

      if (!videoFile) {
        toast.error("動画ファイルを選択してください");
        return;
      }

      const videoUrl = await uploadFileToR2({
        file: videoFile,
        bucketName: "spotlight",
        fileType: "video",
        fileNamePrefix: "spotlight",
      });

      if (!videoUrl) {
        toast.error("動画のアップロードに失敗しました");
        return;
      }

      const { error } = await supabaseClient.from("spotlights").insert({
        video_path: videoUrl,
        title: values.title,
        author: values.author,
        genre: values.genre,
        description: values.description,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Spotlightに投稿しました!");
      spotlightUploadModal.onClose();
    } catch (error) {
      console.error(error);
      toast.error("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Spotlightに動画を投稿"
      description="動画をアップロードしてSpotlightで共有しましょう！"
      isOpen={spotlightUploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="動画のタイトル"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="投稿者名"
        />
        {/* ジャンル選択用のSelect */}
        <Input
          id="genre"
          disabled={isLoading}
          {...register("genre")}
          placeholder="ジャンルを記載"
        />
        {/* 説明入力用のTextarea */}
        <Textarea
          id="description"
          disabled={isLoading}
          {...register("description")}
          placeholder="動画の説明"
          className="resize-none" // リサイズ不可にする
        />
        <div>
          <div className="pb-1">動画ファイル</div>
          <Input
            type="file"
            accept="video/*"
            id="video"
            disabled={isLoading}
            {...register("video", { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          投稿する
        </Button>
      </form>
    </Modal>
  );
};

export default SpotlightUploadModal;
