import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music2, Mic2 } from "lucide-react";
import { ReactNode } from "react";

interface MusicTabsProps {
  onTabChange?: (value: "songs" | "suno") => void;
  songsContent: ReactNode;
  sunoContent: ReactNode;
  defaultTab?: "songs" | "suno";
}

const MusicTabs = ({
  onTabChange,
  songsContent,
  sunoContent,
  defaultTab = "songs",
}: MusicTabsProps) => {
  return (
    <Tabs
      defaultValue={defaultTab}
      className="w-full"
      onValueChange={(value) => onTabChange?.(value as "songs" | "suno")}
    >
      <div className="relative border-b border-neutral-800">
        <TabsList className="bg-transparent relative">
          <TabsTrigger
            value="songs"
            className="group relative px-8 py-3 data-[state=active]:bg-transparent"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-data-[state=active]:opacity-10 transition-opacity duration-300 rounded-t-lg" />
            <div className="relative flex items-center space-x-2">
              <Music2 className="w-4 h-4" />
              <span>Songs</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300" />
          </TabsTrigger>
          <TabsTrigger
            value="suno"
            className="group relative px-8 py-3 data-[state=active]:bg-transparent"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 group-data-[state=active]:opacity-10 transition-opacity duration-300 rounded-t-lg" />
            <div className="relative flex items-center space-x-2">
              <Mic2 className="w-4 h-4" />
              <span>Suno</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300" />
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="songs"
        className="pt-8 transition-all duration-300 animate-in fade-in-50"
      >
        {songsContent}
      </TabsContent>

      <TabsContent
        value="suno"
        className="pt-8 transition-all duration-300 animate-in fade-in-50"
      >
        {sunoContent}
      </TabsContent>
    </Tabs>
  );
};

export default MusicTabs;
