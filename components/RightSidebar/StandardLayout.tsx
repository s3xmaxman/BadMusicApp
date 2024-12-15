import React, { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaMusic } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { MdLyrics } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { FaHashtag } from "react-icons/fa";
import { IoMdSwap } from "react-icons/io";
import { BackgroundGradient } from "../ui/background-gradient";
import { ScrollArea } from "../ui/scroll-area";
import { Song, SunoSong } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { BiChevronRight } from "react-icons/bi";
import { splitTags } from "@/libs/utils";

interface StandardLayoutProps {
  song: Song | SunoSong;
  imagePath: string;
  nextSong: Song | SunoSong;
  nextImagePath: string;
  toggleLayout: () => void;
}

const ON_ANIMATION = 500;
const MAX_VISIBLE_TAGS = 3;

const StandardLayout = memo(
  ({
    song,
    imagePath,
    nextSong,
    nextImagePath,
    toggleLayout,
  }: StandardLayoutProps) => {
    const isSunoSong = "audio_url" in song;

    const [showAllTags, setShowAllTags] = useState(false);
    const tags = isSunoSong ? splitTags(song.tags) : splitTags(song.genre);

    const uniqueTags = Array.from(new Set(tags));
    const visibleTags = showAllTags
      ? uniqueTags
      : uniqueTags.slice(0, MAX_VISIBLE_TAGS);
    const hasMoreTags = tags.length > MAX_VISIBLE_TAGS;

    return (
      <div className="relative h-[calc(100vh-6rem)] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white rounded-xl">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-purple-500/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/20 blur-[100px] rounded-full" />
        </div>

        <div className="h-full w-full overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col gap-6 p-6">
              {/* Album Art with Layout Switch Button */}
              <div className="relative">
                <motion.button
                  onClick={toggleLayout}
                  className="absolute top-2 right-2 z-20 bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoMdSwap className="text-white" size={20} />
                </motion.button>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full aspect-square max-w-md mx-auto"
                >
                  <BackgroundGradient className="rounded-2xl overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={imagePath || "/images/loading.jpg"}
                        alt="曲のイメージ"
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-sm">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaMusic className="text-white text-6xl" />
                        </motion.div>
                      </div>
                    </div>
                  </BackgroundGradient>
                </motion.div>
              </div>

              {/* Song Info, Stats and Tags - Updated Layout */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col md:flex-row justify-between items-center gap-4"
              >
                <div className="text-center md:text-left flex-1">
                  <motion.h1
                    className=" text-3xl md:text-4xl font-bold tracking-wide line-clamp-2 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
                    initial={{
                      x: song.title.length > ON_ANIMATION ? "100%" : 0,
                    }}
                    animate={{ x: 0 }}
                    transition={{
                      duration: song.title.length > ON_ANIMATION ? 22 : 0,
                      repeat: song.title.length > ON_ANIMATION ? Infinity : 0,
                      ease: "linear",
                    }}
                  >
                    <Link
                      href={
                        isSunoSong
                          ? `/suno-songs/${song.id}`
                          : `/songs/${song.id}`
                      }
                    >
                      {song.title}
                    </Link>
                  </motion.h1>
                  <p className="text-gray-400 mt-1 text-lg">{song.author}</p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <CiPlay1 size={18} />
                      <span className="text-base">{song.count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AiOutlineHeart size={18} />
                      <span className="text-base">{song.like_count}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tags Section - New Accordion Layout */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tags" className="border-white/10">
                  <AccordionTrigger className="text-xl font-semibold text-gray-200 hover:no-underline flex items-center gap-2 justify-start group">
                    <span className="flex items-center gap-2">
                      <FaHashtag />
                      {isSunoSong ? "タグ" : "ジャンル"}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {visibleTags.map((tag, index) => (
                        <Link
                          key={tag}
                          href={isSunoSong ? `/tag/${tag}` : `/genre/${tag}`}
                          className="bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                      {hasMoreTags && !showAllTags && (
                        <button
                          onClick={() => setShowAllTags(true)}
                          className="flex items-center bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
                        >
                          +{tags.length - MAX_VISIBLE_TAGS}
                          <BiChevronRight className="ml-1" />
                        </button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Lyrics Section */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="lyrics" className="border-white/10">
                  <AccordionTrigger className="text-xl font-semibold text-gray-200 hover:no-underline flex items-center gap-2 justify-start group">
                    <span className="flex items-center gap-2">
                      <MdLyrics className="text-2xl" />
                      歌詞
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-left">
                      {isSunoSong
                        ? song.lyric
                        : song.lyrics || "歌詞はありません"}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Next Song */}
              {nextSong && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex-1"
                >
                  <h2 className="text-gray-400 text-sm font-medium mb-2">
                    次の曲
                  </h2>
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm cursor-pointer">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={nextImagePath || "/images/playlist.png"}
                        alt="次の曲"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 64px, 64px"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium line-clamp-1">
                        {nextSong.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {nextSong.author}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }
);

StandardLayout.displayName = "StandardLayout";

export default StandardLayout;
