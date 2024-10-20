import { MouseEvent, useState, useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Repeat } from "lucide-react";
import Image from "next/image";
import { formatTime } from "@/libs/helpers";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import { useSoundCloudPlayer } from "@/hooks/useSoundCloudPlayer";
import ReactPlayer from "react-player";
import { SoundCloudContext } from "@/providers/SoundCloudProvider";

interface SoundCloudItemProps {
  data: {
    id: number;
    name: string;
    url: string;
  };
}

const SoundCloudItem: React.FC<SoundCloudItemProps> = ({ data }) => {
  const { setCurrentUrl } = useContext(SoundCloudContext);

  const handleItemClick = () => {
    setCurrentUrl(data.url);
  };

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-neutral-400/10 rounded-lg text-card-foreground shadow-sm cursor-pointer"
      onClick={handleItemClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <div className="absolute inset-0 pointer-events-none">
            <ReactPlayer url={data.url} width="100%" height="100%" />
          </div>
        </div>
        {/* Track title */}
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{data.name}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundCloudItem;
