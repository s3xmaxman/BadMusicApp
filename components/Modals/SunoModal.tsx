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
      title="Generate Audio"
      description="Create custom audio using AI"
      isOpen={sunoModal.isOpen}
      onChange={sunoModal.onClose}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <Input
            id="prompt"
            placeholder="Describe the audio you want to generate..."
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
          <Label htmlFor="instrumental">Make Instrumental</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="wait"
            defaultChecked
            disabled={isLoading}
            onCheckedChange={(checked) => (initialValues.wait_audio = checked)}
          />
          <Label htmlFor="wait">Wait for Audio</Label>
        </div>

        {audioUrl && (
          <div className="mt-4">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button disabled={isLoading} onClick={sunoModal.onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={() => onSubmit(initialValues)}>
            {isLoading ? "Generating..." : "Generate Audio"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SunoModal;
