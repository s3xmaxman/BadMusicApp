'use client'
import React from 'react';
import Image from 'next/image';
import useLoadImage from '@/hooks/useLoadImage';
import usePlayer from '@/hooks/usePlayer';
import useGetSongById from '@/hooks/useGetSongById';
import { FaMusic } from 'react-icons/fa';


const RightSidebar = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const imagePath = useLoadImage(song!);
 
  if (!song) {
    return null
  }
  
  return (
    <div className="bg-gradient-to-b from-violet-950 text-white p-4 h-full flex flex-col items-center rounded-lg">
      <div className="relative w-full max-w-xs mx-auto">
        <Image
          src={imagePath || '/images/RightSide.png'}
          alt="Song Image"
          width={600}
          height={600}
          className="w-full object-cover rounded-lg shadow-lg transition-all duration-500 ease-in-out"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <FaMusic className="text-white text-6xl" />
        </div>
      </div>
      <div className="mt-4 text-center">
        <h1 className="text-3xl font-bold tracking-wide">{song.title}</h1>
        <p className="text-lg text-gray-300">{song.author}</p>
      </div>
    </div>
  );
};

export default RightSidebar;
