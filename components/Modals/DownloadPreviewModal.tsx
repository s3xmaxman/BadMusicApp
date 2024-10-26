import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Music, Video } from "lucide-react";

interface PreviewDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  audioUrl?: string;
  videoUrl?: string;
  onDownload: (type: "audio" | "video") => void;
}

// TODO: このモーダルを閉じた場合にinvalid input syntax for type bigint:のエラーが出るのを解決する
const PreviewDownloadModal: React.FC<PreviewDownloadModalProps> = ({
  isOpen,
  onClose,
  title,
  audioUrl,
  videoUrl,
  onDownload,
}) => {
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] bg-black text-white"
        onClick={handleContentClick}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-white/90">
            {title || "Untitled"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 py-6">
          {/* Video Preview */}
          {videoUrl && (
            <div className="space-y-4">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden ring-1 ring-white/10">
                <video
                  className="w-full h-full"
                  controls
                  src={videoUrl}
                  preload="metadata"
                />
              </div>
              <Button
                className="w-full bg-white/10 hover:bg-white/20 text-white border-0 h-12 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onDownload("video")}
              >
                <Video className="w-5 h-5 mr-2 opacity-80" />
                動画をダウンロード
              </Button>
            </div>
          )}

          {/* Audio Preview */}
          {audioUrl && (
            <div className="space-y-4">
              <div className="w-full bg-white/5 rounded-xl p-6 ring-1 ring-white/10">
                <audio
                  className="w-full"
                  controls
                  src={audioUrl}
                  preload="metadata"
                />
              </div>
              <Button
                className="w-full bg-white/10 hover:bg-white/20 text-white border-0 h-12 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onDownload("audio")}
              >
                <Music className="w-5 h-5 mr-2 opacity-80" />
                音声をダウンロード
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDownloadModal;
