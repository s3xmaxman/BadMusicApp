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

/**
 * SoundCloudプレイヤーの状態を管理するカスタムフック
 *
 * @returns {Object} SoundCloudプレイヤーの状態と操作関数
 * @property {string} currentUrl - 現在の曲URL
 * @property {string} currentTitle - 現在の曲タイトル
 * @property {boolean} isPlaying - 再生中かどうか
 * @property {boolean} isLooping - ループ再生中かどうか
 * @property {number} playedSeconds - 再生済み時間（秒）
 * @property {number} duration - 曲の長さ（秒）
 * @property {number} played - 再生済み割合（0〜1）
 * @property {boolean} seeking - シーク中かどうか
 * @property {string} trackImage - トラック画像URL
 * @property {number} volume - 音量（0〜1）
 * @property {React.RefObject} playerRef - ReactPlayerの参照
 * @property {number} currentSoundCloudIndex - 現在の曲インデックス
 * @property {number[]} playOrder - 再生順序
 * @property {boolean} isShuffled - シャッフル中かどうか
 * @property {function} setCurrentUrl - 現在の曲URLを設定する関数
 * @property {function} setCurrentTitle - 現在の曲タイトルを設定する関数
 * @property {function} setIsPlaying - 再生状態を設定する関数
 * @property {function} setIsLooping - ループ状態を設定する関数
 * @property {function} setPlayedSeconds - 再生済み時間を設定する関数
 * @property {function} setDuration - 曲の長さを設定する関数
 * @property {function} setPlayed - 再生済み割合を設定する関数
 * @property {function} setSeeking - シーク状態を設定する関数
 * @property {function} setTrackImage - トラック画像を設定する関数
 * @property {function} setVolume - 音量を設定する関数
 * @property {function} setPlayerRef - ReactPlayerの参照を設定する関数
 * @property {function} setCurrentSoundCloudIndex - 現在の曲インデックスを設定する関数
 * @property {function} setPlayOrder - 再生順序を設定する関数
 * @property {function} setIsShuffled - シャッフル状態を設定する関数
 * @property {function} handleSeekMouseDown - シーク開始時の処理
 * @property {function} handleSeekMouseUp - シーク終了時の処理
 * @property {function} handleProgress - 再生進捗更新時の処理
 * @property {function} handleDuration - 曲の長さ更新時の処理
 * @property {function} handleVolumeChange - 音量変更時の処理
 * @property {function} toggleMute - ミュート切り替え関数
 * @property {function} fetchTrackInfo - トラック情報を取得する関数
 * @property {function} playNextTrack - 次の曲を再生する関数
 * @property {function} playPreviousTrack - 前の曲を再生する関数
 * @property {function} togglePlay - 再生/一時停止切り替え関数
 * @property {function} toggleShuffle - シャッフル切り替え関数
 * @property {function} seekTo - 指定時間にシークする関数
 */
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
      const { currentSoundCloudIndex, playOrder, setCurrentUrl, setIsPlaying } =
        get();
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
