'use client'
import React from 'react';
import Image from 'next/image';
import useLoadImage from '@/hooks/useLoadImage';
import usePlayer from '@/hooks/usePlayer';
import useGetSongById from '@/hooks/useGetSongById';


const RightSidebar = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const imagePath = useLoadImage(song!);
 
  if (!song) {
    return null;
  }

  return (
    <div className="bg-neutral-900 text-white p-4 h-full flex flex-col">
      <div className="flex-grow relative">
        <Image
          src={imagePath || '/images/RightSide.png'}
          alt="Song Image"
          width={600}
          height={600}
          className="w-full object-cover rounded-lg mx-auto"
        />
      </div>
      <div className="mt-4 text-right">
        <h1 className="text-4xl font-bold">{song.title}</h1>
        <p className="text-xl">{song.author}</p>
      </div>
    </div>
  );
};

export default RightSidebar;
