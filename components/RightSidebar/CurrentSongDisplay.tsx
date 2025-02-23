import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiPlay1 } from "react-icons/ci";
import { AiOutlineHeart } from "react-icons/ai";
import { BiChevronRight } from "react-icons/bi";
import { Song } from "@/types";
import { splitTags } from "@/libs/utils";
import ScrollingText from "../ScrollingText";

interface CurrentSongDisplayProps {
  song: Song;
  videoPath?: string;
  imagePath?: string;
}

const MAX_VISIBLE_TAGS = 3;

const CurrentSongDisplay: React.FC<CurrentSongDisplayProps> = React.memo(
  ({ song, videoPath, imagePath }) => {
    const [showAllTags, setShowAllTags] = useState(false);
    const tags = splitTags(song.genre);

    const uniqueTags = Array.from(new Set(tags));
    const visibleTags = showAllTags
      ? uniqueTags
      : uniqueTags.slice(0, MAX_VISIBLE_TAGS);
    const hasMoreTags = tags.length > MAX_VISIBLE_TAGS;

    return (
      <div className="relative w-full h-full">
        {song.video_path ? (
          <video
            src={videoPath!}
            autoPlay
            loop
            muted
            className="z-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={imagePath || "/images/loading.jpg"}
            alt="Song Image"
            fill
            className="z-0 object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black " />

        {/* Current Song Info */}
        <div className="absolute bottom-20 left-0 right-0 p-6 ">
          <h1 className="text-4xl font-bold tracking-wide line-clamp-2 text-white mb-2">
            <Link
              className="cursor-pointer hover:underline"
              href={`/songs/${song.id}`}
            >
              <ScrollingText text={song.title} />
            </Link>
          </h1>
          <p className="text-gray-300 text-xl mb-4">{song.author}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-gray-400 text-lg max-w-[70%]">
              {visibleTags.map((tag, index) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
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
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <CiPlay1 size={24} className="text-white mr-1" />
                <span className="text-white text-lg">{song.count}</span>
              </div>
              <div className="flex items-center">
                <AiOutlineHeart size={24} className="text-white mr-1" />
                <span className="text-white text-lg">{song.like_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CurrentSongDisplay.displayName = "CurrentSongDisplay";

export default CurrentSongDisplay;
