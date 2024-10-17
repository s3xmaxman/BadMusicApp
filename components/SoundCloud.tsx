import ReactPlayer from "react-player";

interface SoundCloudProps {
  url: string;
  volume?: number;
  playing?: boolean;
}

const SoundCloud: React.FC<SoundCloudProps> = ({
  url,
  volume = 0.1,
  playing,
}) => {
  return (
    <ReactPlayer
      url={url}
      width="100%"
      height="100%"
      volume={volume}
      playing={playing}
    />
  );
};

export default SoundCloud;
