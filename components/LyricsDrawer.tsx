import React, { useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

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
      style={{
        transform: y.to((value) => `translateY(${value}%)`),
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "20px",
        overflowY: "auto",
        touchAction: "pan-y",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">歌詞</h2>
        <button onClick={toggleLyrics} className="text-white">
          閉じる
        </button>
      </div>
      <p className="whitespace-pre-wrap">{lyrics}</p>
    </animated.div>
  );
};

export default LyricsDrawer;
