import { useState } from "react";
import SoundCloud from "./SoundCloud";
import { Play, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
    <Card className="overflow-hidden" onClick={togglePlay}>
      <CardContent className="p-0">
        <div className="relative group aspect-square w-full h-48">
          <div className="absolute inset-0">
            <SoundCloud url={data.url} volume={0.1} playing={isPlaying} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-1">{data.name}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundCloudItem;
