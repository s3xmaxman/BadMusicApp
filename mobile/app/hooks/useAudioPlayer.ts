import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Song } from '../types/song';

export const useAudioPlayer = (song: Song) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Error setting audio mode:', error);
      }
    };

    initAudio();
  }, []);

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [song]);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && !isSeeking) {
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);
    }
  };

  const loadAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        song.songUrl,
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      } else {
        setDuration(0);
      }
    } catch (error) {
      console.log('Error loading audio:', error);
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.log('Error playing/pausing:', error);
    }
  };

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  return {
    isPlaying,
    position,
    duration,
    isSeeking,
    seekPosition,
    setIsSeeking,
    setSeekPosition,
    handlePlayPause,
    handleSeek
  };
};