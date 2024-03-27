// components/RightSidebar.tsx
import React from 'react';
import Image from 'next/image';

interface RightSidebarProps {
 song: {
    image: string;
    name: string;
    artist: string;
 };
}

const RightSidebar: React.FC<RightSidebarProps> = ({ song }) => {
  return (
     <div className="fixed right-0 top-0 max-h-screen overflow-auto bg-neutral-900 text-white p-4">
       <Image 
         src={song.image} 
         alt={song.name} 
         className="w-full object-cover rounded-lg" 
         width={600} 
         height={800}
       />
       <div className="mt-4">
         <h2 className="text-xl font-semibold">{song.name}</h2>
         <p className="text-sm">{song.artist}</p>
       </div>
     </div>
  );
 };
 
 export default RightSidebar;
 
 