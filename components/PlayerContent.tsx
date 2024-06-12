"use client";

import useSound from "use-sound";
import { useEffect, useState, useRef, useMemo } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsRepeat1 } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { isMobile } from "react-device-detect";

import { Playlist, Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";

import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import SeekBar from "./Seekbar";
import useLoadImage from "@/hooks/useLoadImage";
import MobilePlayerContent from "./MobilePlayerContent";
import AddPlaylist from "./AddPlaylist";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
  isMobilePlayer: boolean;
  toggleMobilePlayer: () => void;
  playlists: Playlist[];
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  song,
  songUrl,
  isMobilePlayer,
  toggleMobilePlayer,
  playlists,
}) => {
  const imageUrl = useLoadImage(song);
  const player = usePlayer();
  const isRepeating = usePlayer((state) => state.isRepeating);
  const isShuffling = usePlayer((state) => state.isShuffling);
  const [volume, setVolume] = useState(isMobile ? 1 : 0.1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (isRepeating) {
      player.toggleRepeat();
    }

    const nextSongId = player.getNextSongId();
    if (nextSongId) {
      player.setId(nextSongId);
    }
  };

  const onPlayPrevious = () => {
    if (isRepeating) {
      if (sound) {
        sound.seek(0);
      }
    } else {
      const prevSongId = player.getPreviousSongId();
      if (prevSongId) {
        player.setId(prevSongId);
      }
    }
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    loop: isRepeating,
    onplay: () => {
      setIsPlaying(true);
      setIsPlayingSound(true);
    },
    onend: () => {
      setIsPlaying(false);
      if (isRepeating) {
        play();
      } else {
        onPlayNext();
      }
    },
    onpause: () => {
      setIsPlaying(false);
      setIsPlayingSound(false);
    },
    html5: true,
    format: ["mp3"],
  });

  useEffect(() => {
    if (sound) {
      sound.loop(isRepeating);
    }
  }, [isRepeating]);

  useEffect(() => {
    sound?.play();
    return () => {
      sound?.unload();
    };
  }, [sound]);

  useEffect(() => {
    if (sound) {
      setDuration(sound.duration());
      const interval = setInterval(() => {
        setCurrentTime(sound.seek());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sound]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [songUrl]);

  useEffect(() => {
    if (sound) {
      setCurrentTime(sound.seek());
    }
  }, [sound]);

  useEffect(() => {
    if (sound?._duration) {
      setDuration(sound._duration);
    }
  }, [sound?._duration]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(0.1);
    } else {
      setVolume(0);
    }
  };

  const toggleRepeat = () => {
    player.toggleRepeat();
  };

  const toggleShuffle = () => {
    player.toggleShuffle();
  };

  const formatTime = useMemo(() => {
    return (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
  }, []);

  const formattedCurrentTime = useMemo(
    () => formatTime(currentTime),
    [currentTime, sound]
  );

  const formattedDuration = useMemo(
    () => formatTime(duration),
    [duration, sound]
  );

  const handleSeek = (time: number) => {
    if (sound) {
      sound.seek(time);
      setCurrentTime(time);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} onClick={toggleMobilePlayer} />
        </div>
      </div>

      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>

      {/* PC版のレイアウト */}
      <div className="hidden md:flex flex-col w-full md:justify-center items-center max-w-[722px] gap-x-6">
        <div className="flex items-center gap-x-8">
          <FaRandom
            onClick={toggleShuffle}
            size={20}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            style={{ color: isShuffling ? "green" : "white" }}
          />
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30}
            className=" text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-7 w-7 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30}
            className=" text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <BsRepeat1
            onClick={toggleRepeat}
            size={25}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            style={{ color: isRepeating ? "green" : "white" }}
          />
        </div>

        <div className="flex items-center gap-x-2 mt-4 w-full lg:max-w-[800px] md:max-w-[300px]">
          <span className="w-[50px] text-center inline-block">
            {formattedCurrentTime}
          </span>
          <SeekBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            className="flex-1 h-2"
          />
          <span className="w-[50px] text-center inline-block">
            {formattedDuration}
          </span>
        </div>
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-full md:w-[120px] lg:w-[200px]">
          <AddPlaylist playlists={playlists} songId={song.id} />
          <LikeButton songId={song.id} />
          <div className="mx-1" />
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={34}
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>

      {isMobilePlayer && (
        <MobilePlayerContent
          song={song}
          playlists={playlists}
          songUrl={songUrl}
          imageUrl={imageUrl || "/images/music-placeholder.png"}
          currentTime={currentTime}
          duration={duration}
          formattedCurrentTime={formattedCurrentTime}
          formattedDuration={formattedDuration}
          isPlaying={isPlaying}
          isShuffling={isShuffling}
          isRepeating={isRepeating}
          handlePlay={handlePlay}
          handleSeek={handleSeek}
          toggleMobilePlayer={toggleMobilePlayer}
          toggleShuffle={toggleShuffle}
          toggleRepeat={toggleRepeat}
          onPlayNext={onPlayNext}
          onPlayPrevious={onPlayPrevious}
        />
      )}
    </div>
  );
};

export default PlayerContent;
