import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Modal from "./Modal";
import useSunoModal from "@/hooks/useSunoModal";
import toast from "react-hot-toast";
import Input from "../Input";

const SunoModal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const sunoModal = useSunoModal();

  const [formData, setFormData] = useState({
    prompt: "",
    lyrics: "",
    tags: "",
    title: "",
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

  const onSubmit = async () => {
    try {
      setIsLoading(true);
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success("音声を生成しました！");
    } catch (error) {
      console.error("Error generating audio:", error);
      toast.error("音声の生成に失敗しました");
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
          <Label htmlFor="instrumental">インストゥルメンタル</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="wait"
            checked={formData.wait_audio}
            disabled={isLoading}
            onCheckedChange={(checked) =>
              handleInputChange("wait_audio", checked)
            }
          />
          <Label htmlFor="wait">生成を待つ</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button disabled={isLoading} onClick={sunoModal.onClose}>
            キャンセル
          </Button>
          <Button disabled={isLoading} onClick={onSubmit}>
            {isLoading ? "生成中..." : "作成"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SunoModal;
