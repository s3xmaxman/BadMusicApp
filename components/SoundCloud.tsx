import React from "react";
import ReactPlayer from "react-player";

interface SoundCloudProps {
  name: string;
  url: string;
  id: number;
}

const SoundCloud = ({ name, url, id }: SoundCloudProps) => {
  return <ReactPlayer url={url} width="100%" height="100%" volume={0.1} />;
};

export default SoundCloud;
