import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { X } from "lucide-react";
import useSpotlightModal from "@/hooks/useSpotlightModal";

const SpotlightModal = () => {
  const { isOpen, onClose } = useSpotlightModal();
  const selectedItem = useSpotlightModal((state) => state.selectedItem);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current && isOpen) {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Video playback failed:", error);
          setIsPlaying(false);
        }
      }
    };

    if (isOpen) {
      playVideo();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, [isOpen, selectedItem]);

  if (!selectedItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/60 z-50">
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl mx-auto flex bg-black h-[65vh]">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-2 top-2 z-10 p-2 hover:bg-neutral-800/50 rounded-full"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              {/* Video Section - Left Half */}
              <div className="w-1/2 h-full bg-black flex items-center justify-center">
                {selectedItem.video_path && (
                  <video
                    ref={videoRef}
                    key={selectedItem.video_path}
                    src={selectedItem.video_path}
                    loop
                    playsInline
                    className="h-full w-full object-contain"
                    onLoadedData={() => {
                      if (videoRef.current && !isPlaying) {
                        videoRef.current.play();
                      }
                    }}
                  />
                )}
              </div>

              {/* Content Section - Right Half */}
              <div className="w-1/2 h-full flex items-center">
                <div className="p-4 space-y-6">
                  <div className="flex flex-col space-y-3">
                    {/* Header */}
                    <h2 className="text-xl font-bold text-white">
                      {selectedItem.title}
                    </h2>

                    {/* Metadata */}
                    <div className="space-y-1">
                      <p className="text-neutral-400 text-sm">
                        Artist: {selectedItem.author}
                      </p>
                      <p className="text-neutral-400 text-sm">
                        Genre: {selectedItem.genre}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="mt-2">
                      <p className="text-neutral-300 text-sm whitespace-pre-wrap">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SpotlightModal;
