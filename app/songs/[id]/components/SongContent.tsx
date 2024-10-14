"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaHeart, FaShare, FaDownload, FaEdit } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadImage from "@/hooks/useLoadImage";
import useOnPlay from "@/hooks/useOnPlay";
import useLoadImages from "@/hooks/useLoadImages";
import useDownload from "@/hooks/useDownload";
import EditModal from "@/components/EditModal";
import { useUser } from "@/hooks/useUser";
import useGetSongsByGenres from "@/hooks/useGetSongGenres";

interface SongContentProps {
  songId: string;
}

const SongContent: React.FC<SongContentProps> = ({ songId }) => {
  const { song } = useGetSongById(songId);
  const { user } = useUser();
  const imageUrl = useLoadImage(song!);
  const onPlay = useOnPlay([song!]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const genres = useMemo(
    () => song?.genre?.split(",").map((g) => g.trim()) || [],
    [song?.genre]
  );

  const { songGenres } = useGetSongsByGenres(genres, songId);
  const imageUrls = useLoadImages(songGenres);
  const { fileUrl, loading } = useDownload(song?.song_path!);

  useEffect(() => {
    const timer = setTimeout(() => setShowLyrics(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = () => setIsEditModalOpen(true);

  const handleDownloadClick = () => {
    setIsLoading(true);
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", song?.title || "download");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    setIsLoading(false);
  };

  if (!song) return null;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-4 md:px-10 lg:px-20 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col lg:flex-row items-start gap-12"
      >
        <div className="w-full lg:w-2/5 flex-shrink-0">
          <motion.div
            className="relative w-full aspect-square rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(79, 209, 197, 0.3)",
            }}
            transition={{ duration: 0.3 }}
            onClick={() => onPlay(songId)}
          >
            <Image
              src={imageUrl || "/images/wait.jpg"}
              alt="Song Image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <FaPlay className="text-white text-6xl" />
            </div>
          </motion.div>
          <motion.div
            className="flex justify-between mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition duration-300"
            >
              <FaPlay className="text-cyan-400" />
              <span className="text-cyan-400">{song?.count}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition duration-300"
            >
              <FaHeart className="text-pink-500" />
              <span className="text-pink-500">{song?.like_count}</span>
            </motion.button>
          </motion.div>
        </div>
        <div className="flex flex-col lg:w-3/5 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              {song?.title}
            </h1>
            <p className="text-xl text-gray-300">{song?.author}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {song?.genre?.split(", ").map((g) => (
              <Link href={`/genre/${encodeURIComponent(g)}`} key={g}>
                <span className="text-sm bg-gray-800 text-cyan-400 rounded-full px-4 py-2 hover:bg-gray-700 transition duration-300">
                  #{g}
                </span>
              </Link>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition duration-300"
            >
              <FaShare className="text-xl" />
              Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadClick}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition duration-300"
              disabled={loading}
            >
              <FaDownload className="text-xl" />
              {loading ? "Downloading.." : "Download"}
            </motion.button>
            {user?.id === song?.user_id && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditClick}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition duration-300"
              >
                <FaEdit className="text-xl" />
                Edit
              </motion.button>
            )}
          </motion.div>
          <AnimatePresence>
            {showLyrics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                  Lyrics
                </h2>
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 max-h-96 overflow-y-auto text-gray-300 whitespace-pre-line custom-scrollbar">
                  {song?.lyrics}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-20"
      >
        <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Similar Tracks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {songGenres.map((otherSong, index) => (
            <Link href={`/songs/${otherSong.id}`} key={otherSong.id}>
              <motion.div
                className="bg-gray-800 bg-opacity-30 rounded-xl overflow-hidden shadow-lg"
                whileHover={{
                  y: -10,
                  boxShadow: "0 0 25px rgba(79, 209, 197, 0.3)",
                  transition: { duration: 0.3 },
                }}
              >
                <div className="relative h-48">
                  <Image
                    src={imageUrls[index] || "/images/liked.png"}
                    alt={otherSong.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {otherSong.title}
                    </h3>
                    <p className="text-cyan-400 text-sm truncate">
                      {otherSong.author}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
      {song && (
        <EditModal
          song={song}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default React.memo(SongContent);
