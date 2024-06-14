"use client";

import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";

interface PageContentProps {
  songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  if (!songs) {
    return (
      <div className="mt-4 text-neutral-400">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4"></div>
      <div className="flex-grow">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-3">
          {songs.map((item) => (
            <SongItem onClick={(id) => onPlay(id)} key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageContent;
