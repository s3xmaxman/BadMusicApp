"use client";
import React, { useState } from "react";
import { CiPlay1, CiHeart, CiShare1 } from "react-icons/ci";
import { FaDownload, FaEdit } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadImage from "@/hooks/useLoadImage";

import Link from "next/link";
import useOnPlay from "@/hooks/useOnPlay";
import useLoadImages from "@/hooks/useLoadImages";
import useDownload from "@/hooks/useDownload";
import EditModal from "@/components/EditModal";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import useGetSongsByGenres from "@/hooks/useGetSongGenres";

interface SongContentProps {
  songId: string;
}

const SongContent: React.FC<SongContentProps> = ({ songId }) => {
  const { song } = useGetSongById(songId);
  const { user } = useUser();
  const imageUrl = useLoadImage(song!);
  const { songGenres } = useGetSongsByGenres(
    song?.genre ? song.genre.split(",") : [],
    songId
  );
  const imageUrls = useLoadImages(songGenres);
  const { fileUrl, loading } = useDownload(song?.song_path!);
  const onPlay = useOnPlay([song!]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDownloadClick = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", song?.title || "download");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white px-4 md:px-10 lg:px-20 py-8">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        <div className="w-full lg:w-1/3 flex-shrink-0">
          <motion.div
            className="relative w-full aspect-square overflow-hidden rounded-xl shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => onPlay(songId)}
          >
            <Image
              src={imageUrl || ""}
              alt="Song Image"
              fill
              className="rounded-xl object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <CiPlay1 className="text-white text-6xl" />
            </div>
          </motion.div>
          <div className="flex items-center gap-2 mt-4">
            <button className="text-white opacity-70 hover:opacity-100 transition duration-300">
              <CiPlay1 />
            </button>
            <span className="text-white opacity-70 hover:opacity-100 transition duration-300">
              {song?.count}
            </span>
            <button className="text-white opacity-70 hover:opacity-100 transition duration-300">
              <CiHeart />
            </button>
            <span className="text-white opacity-70 hover:opacity-100 transition duration-300">
              {song?.count}
            </span>
          </div>
        </div>
        <div className="flex flex-col lg:w-2/3 gap-4">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold">{song?.title}</h1>
            <p className="text-gray-400 text-lg lg:text-xl">{song?.author}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {song?.genre?.split(", ").map((g) => (
              <span
                key={g}
                className="text-sm bg-gray-800 text-white rounded-full px-3 py-1 hover:bg-gray-700 transition duration-300"
              >
                <Link href={`/genre/${decodeURIComponent(g)}`}>#{g}</Link>
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2">
              {/* TODO */}
              <CiShare1 />
              Share
            </button>
            <button
              onClick={handleDownloadClick}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
              disabled={loading}
            >
              <FaDownload />
              Download
            </button>
            {user?.id === song?.user_id && (
              <button
                onClick={handleEditClick}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FaEdit />
                Edit
              </button>
            )}
            {song && (
              <EditModal
                song={song}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
              />
            )}
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold">Lyrics</h2>
            <div className="mt-2 lg:max-h-96 lg:overflow-y-auto text-gray-400 whitespace-pre-line">
              {song?.lyrics}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-2xl lg:text-3xl font-bold">同じジャンルの曲</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {songGenres.map((otherSong, index) => {
            return (
              <Link href={`/songs/${otherSong.id}`} key={otherSong.id}>
                <motion.div
                  className="bg-gradient-to-b from-gray-900 to-black p-4 rounded overflow-hidden transform transition duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={imageUrls[index] || "/images/liked.png"}
                    alt={otherSong.title}
                    width={200}
                    height={200}
                    className="rounded object-cover w-full h-48"
                  />
                  <div className="px-2 py-3">
                    <h3 className="text-lg font-semibold text-white font-title-font">
                      {otherSong.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{otherSong.author}</p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SongContent;
