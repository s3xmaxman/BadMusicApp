import React, { useState } from "react";
import Image from "next/image";
import { FaRandom } from "react-icons/fa";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { BsRepeat1 } from "react-icons/bs";
import SeekBar from "./Seekbar";
import { Playlist, Song } from "@/types";
import LikeButton from "./LikeButton";
import AddPlaylist from "./AddPlaylist";
import Link from "next/link";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

interface MobilePlayerContentProps {
  song: Song;
  playlists: Playlist[];
  songUrl: string;
  imageUrl: string;
  currentTime: number;
  duration: number;
  formattedCurrentTime: string;
  formattedDuration: string;
  isPlaying: boolean;
  isShuffling: boolean;
  isRepeating: boolean;
  handlePlay: () => void;
  handleSeek: (time: number) => void;
  toggleMobilePlayer: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
}

const MobilePlayerContent: React.FC<MobilePlayerContentProps> = ({
  song,
  playlists,
  songUrl,
  imageUrl,
  currentTime,
  formattedCurrentTime,
  formattedDuration,
  duration,
  isPlaying,
  isShuffling,
  isRepeating,
  handlePlay,
  handleSeek,
  toggleShuffle,
  toggleRepeat,
  toggleMobilePlayer,
  onPlayNext,
  onPlayPrevious,
}) => {
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const [showLyrics, setShowLyrics] = useState(false);

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx, my], velocity }) => {
      api.start({ y: down ? my : 0, immediate: down });
      if (!down && my > 50) {
        toggleMobilePlayer();
      }
    },
    { axis: "y", bounds: { top: 0 } }
  );

  return (
    <animated.div
      {...bind()}
      style={{
        y,
        touchAction: "none",
      }}
      className="md:hidden fixed inset-0 bg-black text-white"
    >
      <div className="relative w-full h-full">
        <Image
          src={imageUrl || "/images/wait.jpg"}
          alt={song.title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />

        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="w-full h-1 bg-gray-700 rounded-full" />

          <div className="flex-1" onClick={toggleLyrics} />

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <Link href={`/songs/${song.id}`}>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg hover:underline">
                    {song.title}
                  </h1>
                </Link>
                {song?.genre
                  ?.split(", ")
                  .slice(0, 2)
                  .map((g) => (
                    <Link
                      key={g}
                      className="ml-1 cursor-pointer hover:underline"
                      href={`/genre/${g}`}
                    >
                      #{g}
                    </Link>
                  ))}
                <p className="text-lg text-gray-200 drop-shadow-lg">
                  {song.author}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <AddPlaylist playlists={playlists} songId={song.id} />
                <LikeButton songId={song.id} />
              </div>
            </div>

            <SeekBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              className="w-full h-1"
            />

            <div className="flex justify-between items-center">
              <span className="text-sm">{formattedCurrentTime}</span>
              <span className="text-sm">{formattedDuration}</span>
            </div>

            <div className="flex items-center justify-between">
              <FaRandom
                onClick={toggleShuffle}
                size={20}
                className={`cursor-pointer transition ${
                  isShuffling ? "text-[#4c1d95]" : "text-gray-400"
                }`}
              />
              <AiFillStepBackward
                onClick={onPlayPrevious}
                size={24}
                className="text-gray-400 cursor-pointer hover:text-white transition"
              />
              <div
                onClick={handlePlay}
                className="flex items-center justify-center h-14 w-14 rounded-full bg-[#4c1d95] cursor-pointer"
              >
                <Icon size={24} className="text-white" />
              </div>
              <AiFillStepForward
                onClick={onPlayNext}
                size={24}
                className="text-gray-400 cursor-pointer hover:text-white transition"
              />
              <BsRepeat1
                onClick={toggleRepeat}
                size={20}
                className={`cursor-pointer transition ${
                  isRepeating ? "text-[#4c1d95]" : "text-gray-400"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default MobilePlayerContent;

// return (
//   <animated.div
//     {...bind()}
//     style={{
//       y,
//       touchAction: "none",
//     }}
//     className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-gray-900 to-black text-white px-4 py-6 flex flex-col items-center justify-between"
//   >
//     <div className="w-full h-1 bg-gray-700 rounded-full mb-4" />
//     <div className="w-full max-w-sm flex flex-col items-center justify-between h-full">
//       <div
//         className="flip-container w-full aspect-square perspective-1000 cursor-pointer mb-4 mt-12"
//         onClick={toggleLyrics}
//       >
//         <div
//           className={`flipper relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
//             showLyrics ? "rotate-y-180" : ""
//           }`}
//         >
//           <div className="front absolute w-full h-full backface-hidden">
//             {!showLyrics && (
//               <BackgroundGradient className="relative aspect-square overflow-hidden rounded-2xl">
//                 <Image
//                   src={imageUrl || "/images/wait.jpg"}
//                   alt={song.title}
//                   layout="fill"
//                   objectFit="cover"
//                   className="rounded-2xl"
//                 />
//               </BackgroundGradient>
//             )}
//           </div>
//           <div className="back absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 overflow-y-auto">
//             <Link href={`/songs/${song.id}`}>
//               <h2 className="cursor-pointer hover:underline text-2xl font-bold mb-4">
//                 {song.title}
//               </h2>
//             </Link>
//             <p className="text-gray-400 mb-4">{song.author}</p>
//             <div className="text-sm leading-relaxed overflow-y-auto">
//               {song.lyrics?.split("\n").map((line, index) => (
//                 <p key={index} className="mb-2">
//                   {line}
//                 </p>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="w-full">
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <Link href={`/songs/${song.id}`}>
//               <h1 className="cursor-pointer hover:underline text-xl font-bold">
//                 {song.title}
//               </h1>
//             </Link>
//             {song?.genre
//               ?.split(", ")
//               .slice(0, 2)
//               .map((g) => (
//                 <Link
//                   key={g}
//                   className="ml-1 cursor-pointer hover:underline"
//                   href={`/genre/${g}`}
//                 >
//                   #{g}
//                 </Link>
//               ))}
//             <p className="text-sm text-gray-400">{song.author}</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <AddPlaylist playlists={playlists} songId={song.id} />
//             <LikeButton songId={song.id} />
//           </div>
//         </div>
//         <div className="flex items-center justify-between mb-4">
//           <span className="text-sm">{formattedCurrentTime}</span>
//           <SeekBar
//             currentTime={currentTime}
//             duration={duration}
//             onSeek={handleSeek}
//             className="w-3/4 h-1"
//           />
//           <span className="text-sm">{formattedDuration}</span>
//         </div>
//         <div className="flex items-center justify-between">
//           <FaRandom
//             onClick={toggleShuffle}
//             size={20}
//             className={`cursor-pointer transition ${
//               isShuffling ? "text-[#4c1d95]" : "text-gray-400"
//             }`}
//           />
//           <AiFillStepBackward
//             onClick={onPlayPrevious}
//             size={24}
//             className="text-gray-400 cursor-pointer hover:text-white transition"
//           />
//           <div
//             onClick={handlePlay}
//             className="flex items-center justify-center h-14 w-14 rounded-full bg-[#4c1d95] cursor-pointer"
//           >
//             <Icon size={24} className="text-white" />
//           </div>
//           <AiFillStepForward
//             onClick={onPlayNext}
//             size={24}
//             className="text-gray-400 cursor-pointer hover:text-white transition"
//           />
//           <BsRepeat1
//             onClick={toggleRepeat}
//             size={20}
//             className={`cursor-pointer transition ${
//               isRepeating ? "text-[#4c1d95]" : "text-gray-400"
//             }`}
//           />
//         </div>
//       </div>
//     </div>
//   </animated.div>
// );
