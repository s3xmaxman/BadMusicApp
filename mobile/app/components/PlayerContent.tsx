import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';

interface PlayerContentProps {
  song: {
    id: string;
    title: string;
    artist: string;
    imageUrl: string;
    songUrl: number; 
  };
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song }) => {
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

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && !isSeeking) {
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);
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
            if (sound) {
              await sound.setPositionAsync(value);
            }
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