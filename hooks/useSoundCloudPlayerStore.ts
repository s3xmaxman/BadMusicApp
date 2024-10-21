import { create } from "zustand";
import ReactPlayer from "react-player";
import { SoundCloudUrls } from "@/constants";

interface SoundCloudPlayerStore {
  currentUrl: string;
  currentTitle: string;
  isPlaying: boolean;
  isLooping: boolean;
  playedSeconds: number;
  duration: number;
  played: number;
  seeking: boolean;
  trackImage: string;
  volume: number;
  playerRef: React.RefObject<ReactPlayer> | null;
  currentSoundCloudIndex: number;
  playOrder: number[];
  isShuffled: boolean;

  // State setters
  setCurrentUrl: (url: string) => void;
  setCurrentTitle: (title: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLooping: (isLooping: boolean) => void;
  setPlayedSeconds: (seconds: number) => void;
  setDuration: (duration: number) => void;
  setPlayed: (played: number) => void;
  setSeeking: (seeking: boolean) => void;
  setTrackImage: (image: string) => void;
  setVolume: (volume: number) => void;
  setPlayerRef: (ref: React.RefObject<ReactPlayer>) => void;
  setCurrentSoundCloudIndex: (index: number) => void;
  setPlayOrder: (order: number[]) => void;
  setIsShuffled: (isShuffled: boolean) => void;

  // Event handlers
  handleSeekMouseDown: () => void;
  handleSeekMouseUp: () => void;
  handleProgress: (state: { played: number; playedSeconds: number }) => void;
  handleDuration: (duration: number) => void;
  handleVolumeChange: (volume: number) => void;
  toggleMute: () => void;
  fetchTrackInfo: (url: string) => Promise<void>;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  seekTo: (time: number) => void;
}

export const useSoundCloudPlayerStore = create<SoundCloudPlayerStore>(
  (set, get) => ({
    currentUrl: "",
    currentTitle: "",
    currentAuthor: "",
    isPlaying: false,
    isLooping: false,
    playedSeconds: 0,
    duration: 0,
    played: 0,
    seeking: false,
    trackImage: "",
    volume: 0.1,
    playerRef: null,
    currentSoundCloudIndex: 0,
    playOrder: SoundCloudUrls.map((_, index) => index),
    isShuffled: false,

    // State setters
    setCurrentUrl: (url) => set({ currentUrl: url }),
    setCurrentTitle: (title) => set({ currentTitle: title }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setIsLooping: (isLooping) => set({ isLooping }),
    setPlayedSeconds: (seconds) => set({ playedSeconds: seconds }),
    setDuration: (duration) => set({ duration }),
    setPlayed: (played) => set({ played }),
    setSeeking: (seeking) => set({ seeking }),
    setTrackImage: (image) => set({ trackImage: image }),
    setVolume: (volume) => set({ volume }),
    setPlayerRef: (ref) => set({ playerRef: ref }),
    setCurrentSoundCloudIndex: (index) =>
      set({ currentSoundCloudIndex: index }),
    setPlayOrder: (order) => set({ playOrder: order }),
    setIsShuffled: (isShuffled) => set({ isShuffled }),

    // Event handlers
    handleSeekMouseDown: () => set({ seeking: true }),

    handleSeekMouseUp: () => set({ seeking: false }),

    handleProgress: ({ played, playedSeconds }) => {
      const { seeking, isLooping, duration, playerRef } = get();
      if (!seeking) {
        set({ played, playedSeconds });
      }

      if (isLooping && duration > 0 && playedSeconds >= duration - 1) {
        playerRef?.current?.seekTo(0);
      }
    },

    handleDuration: (duration) => set({ duration }),

    handleVolumeChange: (volume) => set({ volume }),

    toggleMute: () =>
      set((state) => ({ volume: state.volume === 0 ? 0.1 : 0 })),

    fetchTrackInfo: async (url) => {
      try {
        const response = await fetch(
          `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(
            url
          )}`
        );
        const data = await response.json();

        if (data.thumbnail_url) {
          set({ trackImage: data.thumbnail_url });
        }

        if (data.title) {
          set({ currentTitle: data.title });
        }
      } catch (error) {
        console.error("Error fetching track info:", error);
      }
    },

    playNextTrack: () => {
      const {
        currentSoundCloudIndex,
        playOrder,
        setCurrentUrl,
        setIsPlaying,
        setCurrentTitle,
      } = get();
      const currentOrderIndex = playOrder.indexOf(currentSoundCloudIndex);
      const nextOrderIndex = (currentOrderIndex + 1) % playOrder.length;
      const nextIndex = playOrder[nextOrderIndex];
      const nextUrl = SoundCloudUrls[nextIndex].url;
      setCurrentUrl(nextUrl);
      set({ currentSoundCloudIndex: nextIndex });
      setIsPlaying(true);
    },

    playPreviousTrack: () => {
      const { currentSoundCloudIndex, playOrder, setCurrentUrl, setIsPlaying } =
        get();
      const currentOrderIndex = playOrder.indexOf(currentSoundCloudIndex);
      const previousOrderIndex =
        (currentOrderIndex - 1 + playOrder.length) % playOrder.length;
      const previousIndex = playOrder[previousOrderIndex];
      const previousUrl = SoundCloudUrls[previousIndex].url;
      setCurrentUrl(previousUrl);
      set({ currentSoundCloudIndex: previousIndex });
      setIsPlaying(true);
    },

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    toggleShuffle: () => {
      const { isShuffled, playOrder, setPlayOrder } = get();
      const newIsShuffled = !isShuffled;
      set({ isShuffled: newIsShuffled });

      if (newIsShuffled) {
        const newOrder = [...playOrder];
        for (let i = newOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
        }
        setPlayOrder(newOrder);
      } else {
        setPlayOrder(SoundCloudUrls.map((_, index) => index));
      }
    },

    seekTo: (time: number) => {
      const { duration, playerRef } = get();
      if (duration > 0) {
        const newPlayed = time / duration;
        set({ played: newPlayed, playedSeconds: time, seeking: false });
        playerRef?.current?.seekTo(newPlayed);
      }
    },
  })
);
