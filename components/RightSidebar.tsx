
'use client'
import React from 'react';
import Image from 'next/image';
import { Song } from "@/types";
import useLoadImage from '@/hooks/useLoadImage';



interface RightSidebarProps {
 song: Song;
 
}

const RightSidebar: React.FC<RightSidebarProps> = ({ song }) => {
 const imagePath = useLoadImage(song);

 if (!song) {
    return <div>No song selected</div>;
 }

 return (
    <div className="bg-neutral-900 text-white p-4 h-full flex flex-col">
      <div className="flex-grow relative">
        <Image
          src={imagePath || '/images/liked.png'}
          alt="Song Image"
          width={500} // Example width, adjust as needed
          height={500} // Example height, adjust as needed
          className="w-full object-cover rounded-lg mx-auto"
        />
      </div>
      <div className="mt-4 text-right">
        <h2 className="text-xl font-semibold">{song.title}</h2>
        <p className="text-sm">{song.author}</p>
      </div>
    </div>
 );
};

export default RightSidebar;
