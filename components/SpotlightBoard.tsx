import React, { useState, useRef } from "react";
import useSpotlightModal from "@/hooks/useSpotlightModal";

export const SpotlightData = [
  {
    id: 1,
    video_path: "/test.mp4",
    title: "Dystopia",
    author: "Test Man",
    genre: "SynthWave",
    description: "This is Test Data",
  },
  {
    id: 2,
    video_path: "/test2.mp4",
    title: "Neon Dreams",
    author: "Sample Artist",
    genre: "RetroWave",
    description: "Sample Description",
  },
];

const SpotlightBoard = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const spotlightModal = useSpotlightModal();

  const handleVideoHover = (index: number) => {
    setHoveredIndex(index);
    if (videoRefs.current[index]) {
      videoRefs.current[index]
        .play()
        .catch((error) => console.log("Video play failed:", error));
    }
  };

  const handleVideoLeave = () => {
    setHoveredIndex(null);
    // 自コンポーネント内のビデオのみ停止
    videoRefs.current.forEach((video) => {
      if (video) video.pause();
    });
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 px-4">Spotlight</h1>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 w-full">
        {SpotlightData.map((item, index) => (
          <div
            key={item.id}
            className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            onMouseEnter={() => handleVideoHover(index)}
            onMouseLeave={handleVideoLeave}
            onClick={() => spotlightModal.onOpen(item)}
          >
            <video
              ref={(el) => {
                if (el) videoRefs.current[index] = el;
              }}
              src={item.video_path}
              muted={isMuted}
              playsInline
              loop
              className="w-full h-full object-cover"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMuteToggle();
              }}
              className="absolute bottom-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <svg
                className="w-4 h-4 text-white/80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMuted ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM16 12l4 4m0-4l-4 4"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                )}
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotlightBoard;
