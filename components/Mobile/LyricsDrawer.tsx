import React, { useEffect } from "react";
import { animated, useSpring, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { BsChevronDown } from "react-icons/bs";

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
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const drawerHeight = screenHeight * 0.7;

  const [{ y }, api] = useSpring(() => ({ y: drawerHeight }));

  useEffect(() => {
    api.start({
      y: showLyrics ? 0 : drawerHeight,
      config: config.stiff,
    });
  }, [showLyrics, api, drawerHeight]);

  const bind = useDrag(
    ({ last, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
      const newY = my > 0 ? my : 0;
      api.start({ y: newY, immediate: true });

      if (last) {
        if (my > drawerHeight / 2 || (vy > 0.5 && dy > 0)) {
          api.start({ y: drawerHeight, config: config.stiff });
          toggleLyrics();
        } else {
          api.start({ y: 0, config: config.stiff });
        }
      }
    },
    {
      from: () => [0, y.get()],
      bounds: { top: 0, bottom: drawerHeight },
      axis: "y",
    }
  );

  return (
    <animated.div
      {...bind()}
      className="fixed bottom-0 left-0 right-0"
      style={{
        height: `${drawerHeight}px`,
        transform: y.to((value) => `translateY(${value}px)`),
        touchAction: "none",
      }}
    >
      <div className="w-full h-full bg-black bg-opacity-80 backdrop-blur-md rounded-t-2xl shadow-lg overflow-hidden custom-scrollbar">
        <div className="relative h-full overflow-y-auto p-6">
          <div className="absolute top-2 left-0 right-0 flex justify-center">
            <div className="w-10 h-1 rounded-full bg-white opacity-50" />
          </div>
          <button
            onClick={toggleLyrics}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            <BsChevronDown />
          </button>
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            歌詞
          </h2>
          <pre className="whitespace-pre-wrap text-white text-base leading-relaxed">
            {lyrics}
          </pre>
        </div>
      </div>
    </animated.div>
  );
};

export default LyricsDrawer;
