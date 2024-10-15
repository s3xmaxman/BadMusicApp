// components/YouTubePlayer.tsx
import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";

type YouTubePlayerProps = {
  videoId: string;
  name: string;
};

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, name }) => {
  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      mute: 1,
    },
  };

  return (
    <div className="w-full aspect-video">
      <h2 className="text-white text-2xl font-semibold mb-4">{name}</h2>

      <YouTube videoId={videoId} opts={opts} />
    </div>
  );
};

export default YouTubePlayer;
