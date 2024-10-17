import { useState } from "react";
import SoundCloud from "./SoundCloud";

interface SoundCloudItemProps {
  data: {
    id: number;
    name: string;
    url: string;
  };
}

const SoundCloudItem: React.FC<SoundCloudItemProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div
      className="relative group flex  flex-row items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3 w-full"
      onClick={togglePlay}
    >
      <div className="relative aspect-square w-24 h-24 rounded-md overflow-hidden">
        <SoundCloud url={data.url} volume={0.1} playing={isPlaying} />
      </div>
      <div className="flex flex-col items-start justify-between w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full hover:underline">
          {data.name}
        </p>
      </div>
    </div>
  );
};

export default SoundCloudItem;
