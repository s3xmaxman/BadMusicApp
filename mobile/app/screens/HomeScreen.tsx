import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useState } from 'react';
import PlayerContent from '../components/PlayerContent';

const mockSongs = [
  {
    id: '1',
    title: 'Alive',
    artist: 'Unknown Artist',
    imageUrl: 'https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    songUrl: require('../../assets/music/Alive.mp3')
  },
  {
    id: '2',
    title: 'Taking Care of You',
    artist: 'Unknown Artist',
    imageUrl: 'https://images.pexels.com/photos/1887629/pexels-photo-1887629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    songUrl: require('../../assets/music/Taking Care of You.mp3')
  },
];

const HomeScreen = () => {
  const [selectedSong, setSelectedSong] = useState(mockSongs[0]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Music Library</Text>
          
          <View style={styles.songList}>
            {mockSongs.map((song) => (
              <TouchableOpacity
                key={song.id}
                style={styles.songItem}
                onPress={() => setSelectedSong(song)}
              >
                <Image
                  source={{ uri: song.imageUrl }}
                  style={styles.songImage}
                />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song.title}</Text>
                  <Text style={styles.artistName}>{song.artist}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.playerContainer}>
        <PlayerContent song={selectedSong} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717'
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16
  },
  songList: {
    gap: 16
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  songImage: {
    width: 48,
    height: 48,
    borderRadius: 4
  },
  songInfo: {
    marginLeft: 12,
    flex: 1
  },
  songTitle: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16
  },
  artistName: {
    color: '#a3a3a3',
    fontSize: 14
  },
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default HomeScreen;