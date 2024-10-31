import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Modal from "./Modal";
import useSunoModal from "@/hooks/useSunoModal";
import toast from "react-hot-toast";
import Input from "../Input";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const SunoModal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const { user } = useUser();
  const sunoModal = useSunoModal();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    prompt: "",
    lyrics: "",
    tags: "",
    title: "",
    author: "",
    make_instrumental: false,
    wait_audio: true,
    negative_tags: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const checkSunoCookie = async () => {
    const response = await fetch("/api/suno/check_cookie", {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Something went wrong");
    }
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      try {
        await checkSunoCookie();
      } catch (error) {
        toast.error(
          "SunoCookieが設定されていません。アカウント設定で設定してください。"
        );
        setIsLoading(false);
        return;
      }

      const endpoint = isCustom
        ? "/api/suno/custom_generate"
        : "/api/suno/generate";

      const requestData = isCustom
        ? {
            prompt: formData.lyrics,
            tags: formData.tags,
            title: formData.title,
            make_instrumental: formData.make_instrumental,
            wait_audio: formData.wait_audio,
            negative_tags: formData.negative_tags,
          }
        : {
            prompt: formData.prompt,
            make_instrumental: formData.make_instrumental,
            wait_audio: formData.wait_audio,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Something went wrong");
      }

      const songs = await response.json();

      if (!user) {
        throw new Error("ユーザーが見つかりません");
      }

      // 各曲をsuno_songsテーブルに保存
      for (const song of songs) {
        const songIdMatch = song.audio_url.match(/item_id=([a-f0-9-]+)/);
        const songId = songIdMatch ? songIdMatch[1] : null;

        const { error } = await supabaseClient.from("suno_songs").insert({
          user_id: user.id,
          song_id: songId,
          title: song.title || "Untitled",
          author: formData.author || "Unknown",
          image_url: song.image_url || "",
          lyric: song.lyric || "",
          audio_url: song.audio_url || "",
          video_url: song.video_url || "",
          created_at: song.created_at,
          model_name: song.model_name,
          status: song.status,
          gpt_description_prompt: song.gpt_description_prompt || "",
          prompt: song.prompt || "",
          type: song.type || "",
          tags: song.tags || "",
        });

        if (error) {
          console.error("Error saving song to database:", error);
          throw new Error("データベースへの保存に失敗しました");
        }
      }

      router.refresh();
      setIsLoading(false);
      toast.success("音楽を生成しました！");
      sunoModal.onClose();
    } catch (error) {
      console.error("Error generating audio:", error);
      toast.error("音楽の生成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Suno AI"
      description="AIを使ってカスタムソングを作成します"
      isOpen={sunoModal.isOpen}
      onChange={sunoModal.onClose}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="mode"
            checked={isCustom}
            onCheckedChange={setIsCustom}
            disabled={isLoading}
          />
          <Label htmlFor="mode">カスタム生成モード</Label>
        </div>

        {isCustom ? (
          <>
            <div>
              <Label htmlFor="lyrics">歌詞</Label>
              <Textarea
                id="lyrics"
                placeholder="歌詞を入力してください..."
                className="mt-1"
                disabled={isLoading}
                value={formData.lyrics}
                onChange={(e) => handleInputChange("lyrics", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                placeholder="曲のタイトルを入力..."
                disabled={isLoading}
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="author">アーティスト</Label>
              <Input
                id="author"
                placeholder="アーティスト名を入力..."
                className="mt-1"
                disabled={isLoading}
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="tags">ジャンル (タグ)</Label>
              <Textarea
                id="tags"
                placeholder="例: pop, rock, electronic..."
                className="mt-1"
                disabled={isLoading}
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                推奨: pop, rock, jazz, classical, electronic, hip-hop, r&b,
                country, folk, metal など
              </p>
            </div>
          </>
        ) : (
          <div>
            <Label htmlFor="prompt">プロンプト</Label>
            <Input
              id="prompt"
              placeholder="音楽のジャンルやスタイルを入力..."
              className="mt-1"
              disabled={isLoading}
              value={formData.prompt}
              onChange={(e) => handleInputChange("prompt", e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="instrumental"
            checked={formData.make_instrumental}
            disabled={isLoading}
            onCheckedChange={(checked) =>
              handleInputChange("make_instrumental", checked)
            }
          />
          <Label htmlFor="instrumental">Instrumental</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="wait"
            checked={formData.wait_audio}
            disabled={true}
            onCheckedChange={(checked) =>
              handleInputChange("wait_audio", checked)
            }
          />
          <Label htmlFor="wait">生成を待つ</Label>
        </div>

        <div className="flex justify-end space-x-2 ">
          <Button
            disabled={isLoading}
            onClick={sunoModal.onClose}
            className="hover:underline"
          >
            キャンセル
          </Button>
          <Button
            disabled={isLoading}
            onClick={onSubmit}
            className="hover:underline"
          >
            {isLoading ? "生成中..." : "作成"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SunoModal;
