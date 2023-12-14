"use client";

import useSound from 'use-sound';
import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsRepeat1 } from "react-icons/bs";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";

import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import Seekbar from './Seekbar';


interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ 
  song, 
  songUrl
}) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(0.1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [ value, setValue ] = useState(0);



    // 再生状態に応じてアイコンを切り替えます。
    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    // 音量状態に応じてボリュームアイコンを切り替えます。
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

      // 次の曲を再生する関数です。
    const onPlayNext = () => {
        // 曲がなければ何もしません。
        if (player.ids.length === 0) {
        return;
        }

        // 現在の曲のインデックスを取得し、次の曲のIDを見つけます。
        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        // 次の曲がなければ最初の曲を再生します。
        if (!nextSong) {
        return player.setId(player.ids[0]);
        }

        // 次の曲を再生します。
        player.setId(nextSong);
    }

    // 前の曲を再生する関数です。
    const onPlayPrevious = () => {
    // 曲がなければ何もしません。
    if (player.ids.length === 0) {
      return;
    }

    // 現在の曲のインデックスを取得し、前の曲のIDを見つけます。
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    // 前の曲がなければ最後の曲を再生します。
    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    // 前の曲を再生します。
    player.setId(previousSong);
  }
  

    const [play, {
      pause,
      sound,
      duration: soundDuration,
      stop
    }] = useSound(
      songUrl,
      { 
        volume: volume,
        onplay: () => setIsPlaying(true),
        onend: () => {
          setIsPlaying(false);
          onPlayNext();
        },
        onpause: () => setIsPlaying(false),
        format: ['mp3'],
        onload: () => setDuration(soundDuration), // ロード時に総時間をセット
      }
    );
    

      // // 再生位置の更新を行う useEffect
      // useEffect(() => {
      //   if (isPlaying && sound) {
      //     const interval = setInterval(() => {
      //       setPlaybackTime(sound.seek());
      //     }, 1000);

      //     return () => clearInterval(interval);
      //   }
      // }, [isPlaying, sound]);

      useEffect(() => {
        if (isPlaying && sound) {
        const interval = setInterval(() => {
         const seek = sound.seek();
         const duration = soundDuration;
         if (typeof seek === 'number' && typeof duration === 'number') {
           const percentage = ((seek / duration) * 100);
           setPlaybackTime(percentage);
           setValue(percentage); // Add this line
         }
        }, 1000);
       
        return () => clearInterval(interval);
        }
       }, [isPlaying, sound, soundDuration]);
       
       
       
       

 
   
    // コンポーネントがアンマウントされるときにサウンドをアンロードします。
    useEffect(() => {
        sound?.play(); // サウンドがあれば再生します。
        
        return () => {
        sound?.unload(); // コンポーネントのクリーンアップ時にサウンドをアンロードします。
        }
    }, [sound]);

   
    // 再生ボタンのハンドラです。再生中ではない場合は再生を開始し、そうでなければ一時停止します。
    const handlePlay = () => {
      if (!isPlaying) {
        play();
        } else {
        pause();
      }
    }
  
    // ミュート切り替え関数です。現在ミュートされていれば音量を戻し、そうでなければミュートします。
    const toggleMute = () => {
        if (volume === 0) {
        setVolume(1);
        } else {
        setVolume(0);
        }
    }

    return ( 
      <div className="grid grid-cols-2 md:grid-cols-3 h-full">
          <div className="flex w-full justify-start">
            <div className="flex items-center gap-x-4">
              <MediaItem data={song} />
              <LikeButton songId={song.id} />
            </div>
          </div>   
    
          {/* モバイル表示で再生ボタンを右寄せにする */}
          <div 
            className="
              flex 
              md:hidden 
              col-auto 
              w-full 
              justify-end 
              items-center
            "
          >
            <div 
              onClick={handlePlay} 
              className="
                h-10
                w-10
                flex 
                items-center 
                justify-center 
                rounded-full 
                bg-white 
                p-1 
                cursor-pointer
              "
            >
              <Icon size={30} className="text-black" />
            </div>
          </div>
    
          {/* デスクトップ表示でコントロールを中央にする */}
          <div 
            className="
              hidden
              h-full
              md:flex
              md:col-span-2 
              lg:col-span-1 
              justify-center 
              items-center 
              w-full 
              max-w-[722px] 
              gap-x-6
            "
          >
            {/* 前の曲へ移動 */}
            <AiFillStepBackward
              onClick={onPlayPrevious}
              size={30} 
              className="
                text-neutral-400 
                cursor-pointer 
                hover:text-white 
                transition
              "
            />
            {/* 再生・一時停止 */}
            <div 
              onClick={handlePlay} 
              className="
                flex 
                items-center 
                justify-center
                h-10
                w-10 
                rounded-full 
                bg-white 
                p-1 
                cursor-pointer
                flex-col
              "
            >
              <Icon size={30} className="text-black" />
            </div>
            {/* 次の曲へ移動 */}
            <AiFillStepForward
              onClick={onPlayNext}
              size={30} 
              className="
                text-neutral-400 
                cursor-pointer 
                hover:text-white 
                transition
              " 
            />
            {/* 繰り返し再生 */}
            <BsRepeat1 
              onClick={() => setIsLooping(!isLooping)} 
              size={30} 
              className={`text-neutral-400 cursor-pointer hover:text-white transition ${isLooping ? 'text-green-500' : ''}`} 
            />
            {/* ここにSeekbarコンポーネントを挿入 */}
            <Seekbar 
              max={duration} // 仮の進行度の最大値
              value={playbackTime} // 仮の現在の進行度
              onChange={(value) => {
                sound.seek(value); 
                setPlaybackTime(value); 
              }}
            />
          </div>
          {/* ボリュームコントロール */}
          <div className="hidden md:flex w-full justify-end pr-2">
            <div className="flex items-center gap-x-2 w-[120px]">
              <VolumeIcon 
                onClick={toggleMute} 
                className="cursor-pointer" 
                size={34} 
              />
              <Slider 
                value={volume} 
                onChange={(value) => setVolume(value)}
              />
            </div>
          </div>
        </div>
     );
  
}
 
export default PlayerContent;