import React, { useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { X } from "lucide-react";
import useSpotlightModal from "@/hooks/modal/useSpotlightModal";

const SpotlightModal = () => {
  const { isOpen, onClose } = useSpotlightModal();
  const selectedItem = useSpotlightModal((state) => state.selectedItem);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current && isOpen) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error("Video playback failed:", error);
        }
      }
    };

    if (isOpen) {
      playVideo();
    } else {
      videoRef.current?.pause();
    }

    return () => {
      videoRef.current?.pause();
    };
  }, [isOpen, selectedItem]);

  if (!selectedItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm">
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row bg-black h-[65vh] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-2 top-2 z-10 p-2 hover:bg-neutral-800/50 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white/80 hover:text-white" />
              </button>

              {/* Video Section */}
              <div className="w-full md:w-1/2 bg-black relative overflow-hidden h-2/3 md:h-full">
                {selectedItem.video_path && (
                  <video
                    ref={videoRef}
                    key={selectedItem.video_path}
                    src={selectedItem.video_path}
                    loop
                    playsInline
                    className="absolute h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 h-1/3 md:h-full flex items-center p-8 bg-gradient-to-b from-black/70 to-black/90">
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-200">
                      {selectedItem.title}
                    </h2>

                    {/* Metadata */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-x-4 text-sm">
                        <span className="text-purple-300/90 font-medium">
                          {selectedItem.author}
                        </span>
                        <span className="text-pink-200/80 font-medium">
                          {selectedItem.genre}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap pr-4">
                    {selectedItem.description}
                  </p>
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
