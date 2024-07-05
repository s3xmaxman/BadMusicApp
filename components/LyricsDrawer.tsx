import React, { useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";

interface LyricsDrawerProps {
  showLyrics: boolean;
  toggleLyrics: () => void;
  lyrics: string;
}

const LyricsDrawer: React.FC<LyricsDrawerProps> = ({
  showLyrics,
  toggleLyrics,
  lyrics,
}) => {
  const [{ y }, api] = useSpring(() => ({ y: 100 }));

  useEffect(() => {
    api.start({ y: showLyrics ? 0 : 100 });
  }, [showLyrics, api]);

  return (
    <animated.div
      className="fixed bottom-0 left-0 right-0 h-1/2 text-white p-5 overflow-y-auto touch-pan-y"
      style={{
        transform: y.to((value) => `translateY(${value}%)`),
        background:
          "linear-gradient(to bottom, rgba(24, 24, 24, 0.8), rgba(0, 0, 0, 0.8))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="flex justify-end items-center mb-4">
        <button onClick={toggleLyrics} className="text-white">
          閉じる
        </button>
      </div>
      <p className="whitespace-pre-wrap">{lyrics}</p>
    </animated.div>
  );
};

export default LyricsDrawer;
