import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { Song } from '../types/song';

interface PlayerContentProps {
  song: Song;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song }) => {
  const {
    isPlaying,
    position,
    duration,
    isSeeking,
    seekPosition,
    setIsSeeking,
    setSeekPosition,
    handlePlayPause,
    handleSeek
  } = useAudioPlayer(song);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Image
          source={{ uri: song.imageUrl }}
          style={styles.coverImage}
        />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.artistName}>{song.artist}</Text>
        </View>
        <TouchableOpacity onPress={handlePlayPause}>
          <Icon
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={40}
            color="white"
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.controls}>
        <Slider
          value={isSeeking ? seekPosition : position}
          maximumValue={duration}
          minimumValue={0}
          onSlidingStart={() => {
            setIsSeeking(true);
            setSeekPosition(position);
          }}
          onValueChange={(value) => {
            setSeekPosition(value);
          }}
          onSlidingComplete={async (value) => {
            setIsSeeking(false);
            handleSeek(value);
          }}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#ffffff"
          thumbTintColor="#1DB954"
          style={styles.slider}
        />
        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>
            {formatTime(isSeeking ? seekPosition : position)}
          </Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 16,
    width: '100%'
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  coverImage: {
    width: 48,
    height: 48,
    borderRadius: 4
  },
  songInfo: {
    flex: 1
  },
  songTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  artistName: {
    color: '#a3a3a3',
    fontSize: 14
  },
  controls: {
    marginTop: 16
  },
  slider: {
    width: '100%',
    height: 40
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timeText: {
    color: '#a3a3a3',
    fontSize: 12
  }
});

export default PlayerContent;