"use client";
import React from "react";

import Image from "next/image";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadImage from "@/hooks/useLoadImage";
import { BackgroundGradient } from "@/components/ui/background-gradient";

interface Props {
  songId: string;
}

const SongContent = ({ songId }: Props) => {
  const { song } = useGetSongById(songId);
  const imagePath = useLoadImage(song!);
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/3">
          <BackgroundGradient className="relative aspect-square overflow-hidden rounded-xl ">
            <Image
              src={imagePath || "/images/liked.png"}
              alt="Song Image"
              width={400}
              height={400}
              className="rounded-xl w-full"
            />
          </BackgroundGradient>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-3xl font-bold">{song?.title}</h1>
          <p className="text-gray-400">{song?.author}</p>
          <p className="mt-4">#{song?.genre}</p>
          <div className="mt-4 flex space-x-4">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
              Edit
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/3 mt-8 md:mt-0">
          <h2 className="text-xl font-bold">Lyrics</h2>
          <p className="mt-2 whitespace-pre-line">
            Stirring waves on the ocean breeze, yeah <br />
            Come dance now, come dance, dance <br />
            Dance with me, yeah <br />
            Splashing tides on the endless sea, yeah <br />
            Brightest stars in the night you'll see <br />
            Stirring waves on the ocean breeze, yeah <br />
            Feel that rhythm, feel the heat, yeah <br />
            Lost in motion, in the beat, beat <br />
            Move your body, set it free, yeah <br />
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">More from this creator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="bg-gradient-to-b from-gray-900 to-black p-4 rounded">
            <Image
              src="/path-to-laras-echo-image.jpg"
              alt="Lara's Echo"
              width={200}
              height={200}
              className="rounded"
            />
            <p className="mt-2">Lara's Echo</p>
            <p className="text-gray-400">Electronic, Pop, Rhythmic</p>
          </div>
          <div className="bg-gradient-to-b from-gray-900 to-black p-4 rounded">
            <Image
              src="/path-to-lost-in-bangkok-image.jpg" // Adjust the path if needed
              alt="Lost in Bangkok"
              width={200}
              height={200}
              className="rounded"
            />
            <p className="mt-2">Lost in Bangkok</p>
            <p className="text-gray-400">Electronic, Pop, Rhythmic</p>
          </div>
          <div className="bg-gradient-to-b from-gray-900 to-black p-4 rounded">
            <Image
              src="/path-to-kobe-psynthwave-image.jpg" // Adjust the path if needed
              alt="神戸Psynthwave夜景"
              width={200}
              height={200}
              className="rounded"
            />
            <p className="mt-2">神戸Psynthwave夜景</p>
            <p className="text-gray-400">Style</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongContent;
