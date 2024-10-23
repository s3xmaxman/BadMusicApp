import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import Input from "../Input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import useSunoModal from "@/hooks/useSunoModal";

const SunoModal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const sunoModal = useSunoModal();

  const initialValues = {
    prompt: "",
    make_instrumental: false,
    wait_audio: true,
  };

  const onSubmit = async (data: typeof initialValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/suno/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setAudioUrl(result.audio_url);
      toast.success("Audio generated successfully!");
    } catch (error) {
      console.error("Error generating audio:", error);
      toast.error("Failed to generate audio");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="音声生成"
      description="AIを使ってカスタム音声を作成します"
      isOpen={sunoModal.isOpen}
      onChange={sunoModal.onClose}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="prompt">プロンプト</Label>
          <Input
            id="prompt"
            placeholder="曲のプロンプトを入力してください..."
            className="mt-1"
            disabled={isLoading}
            onChange={(e) => (initialValues.prompt = e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="instrumental"
            disabled={isLoading}
            onCheckedChange={(checked) =>
              (initialValues.make_instrumental = checked)
            }
          />
          <Label htmlFor="instrumental">instrumental</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="wait"
            defaultChecked
            disabled={isLoading}
            onCheckedChange={(checked) => (initialValues.wait_audio = checked)}
          />
          <Label htmlFor="wait">音声生成を待つ</Label>
        </div>

        {audioUrl && (
          <div className="mt-4">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              お使いのブラウザは音声要素をサポートしていません。
            </audio>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button disabled={isLoading} onClick={sunoModal.onClose}>
            キャンセル
          </Button>
          <Button disabled={isLoading} onClick={() => onSubmit(initialValues)}>
            {isLoading ? "生成中..." : "作成"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SunoModal;
