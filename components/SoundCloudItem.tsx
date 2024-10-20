import { useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactPlayer from "react-player";
import { useSoundCloudPlayerStore } from "@/hooks/useSoundCloudPlayerStore";
import { set } from "react-hook-form";

interface SoundCloudItemProps {
  data: {
    id: number;
    title: string;
    url: string;
  };
}

// TODO: クリック時に再生
const SoundCloudItem: React.FC<SoundCloudItemProps> = ({ data }) => {
  const { setCurrentUrl, setCurrentTitle } = useSoundCloudPlayerStore();

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
          <h3 className="text-lg font-semibold line-clamp-1">{data.title}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundCloudItem;
