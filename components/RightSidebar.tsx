'use client'
import React from 'react';
import Image from 'next/image';
import useLoadImage from '@/hooks/useLoadImage';
import usePlayer from '@/hooks/usePlayer';
import useGetSongById from '@/hooks/useGetSongById';
import { FaMusic } from 'react-icons/fa';
import LikeButton from './LikeButton';


const RightSidebar = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const imagePath = useLoadImage(song!);
 
  if (!song) {
    return null
  }
  
  return (
    <div className="bg-gradient-to-b bg-natural-900 text-white p-4 h-full flex flex-col items-start rounded-lg overflow-auto">
      <div className="relative w-full mt-4">
        <Image
          src={imagePath || '/images/RightSide.png'}
          alt="Song Image"
          layout="responsive"
          width={800}
          height={800}
          className="object-cover rounded-lg shadow-lg transition-all duration-500 ease-in-out"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <FaMusic className="text-white text-6xl" />
        </div>
      </div>
      <div className="mt-8">
        <h1 className="text-3xl font-bold tracking-wide">{song.title}</h1>
        <p className="mt-2 text-lg text-gray-300">{song.author}</p>
      </div>
      <div className='mt-2'>
        <LikeButton  songId={song.id} />
      </div>
    </div>
   );
};

export default RightSidebar;
