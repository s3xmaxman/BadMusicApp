import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";
import ReactPlayer from "react-player";

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
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-neutral-400/10 rounded-lg text-card-foreground shadow-sm">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <div className="absolute inset-0">
            <ReactPlayer
              url={data.url}
              width="100%"
              height="100%"
              volume={0.1}
              playing={isPlaying}
              config={{
                soundcloud: {
                  options: {
                    visual: true,
                    show_artwork: false,
                  },
                },
              }}
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-16 h-16 text-white" />
            ) : (
              <Play className="w-16 h-16 text-white" />
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{data.name}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundCloudItem;
