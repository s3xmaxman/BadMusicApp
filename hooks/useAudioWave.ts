import { create } from "zustand";

interface AudioWaveState {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  audioElement: HTMLAudioElement | null;
  source: MediaElementAudioSourceNode | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  currentSongId: string | null;
  audioUrl: string | null;
  isEnded: boolean;
  initializeAudio: (audioUrl: string, songId: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  cleanup: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsEnded: (isEnded: boolean) => void;
}

/**
 * オーディオ波形データを管理するカスタムフック
 *
 * @returns {Object} オーディオ波形の状態と操作関数
 * @property {AudioContext|null} audioContext - Web Audio APIのコンテキスト
 * @property {AnalyserNode|null} analyser - オーディオ分析用ノード
 * @property {HTMLAudioElement|null} audioElement - オーディオ要素
 * @property {MediaElementAudioSourceNode|null} source - メディアソースノード
 * @property {number} currentTime - 現在の再生時間（秒）
 * @property {number} duration - 曲の長さ（秒）
 * @property {boolean} isPlaying - 再生中かどうか
 * @property {string|null} currentSongId - 現在の曲ID
 * @property {string|null} audioUrl - オーディオURL
 * @property {boolean} isEnded - 再生終了したかどうか
 * @property {function} initializeAudio - オーディオの初期化関数
 * @property {function} play - 再生関数
 * @property {function} pause - 一時停止関数
 * @property {function} seek - シーク関数
 * @property {function} cleanup - クリーンアップ関数
 * @property {function} setIsPlaying - 再生状態設定関数
 * @property {function} setIsEnded - 終了状態設定関数
 */
const useAudioWaveStore = create<AudioWaveState>((set, get) => ({
  audioContext: null,
  analyser: null,
  audioElement: null,
  source: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  currentSongId: null,
  audioUrl: null,
  isEnded: false,

  initializeAudio: async (audioUrl: string, songId: string) => {
    const state = get();

    // Clean up existing audio if necessary
    if (state.audioElement) {
      state.cleanup();
    }

    // Create new AudioContext if it doesn't exist
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    // Create and set up audio element
    const audioElement = new Audio(audioUrl);
    audioElement.crossOrigin = "anonymous";
    audioElement.volume = 0.1;

    // Connect audio nodes
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Set up event listeners
    audioElement.addEventListener("timeupdate", () => {
      set({ currentTime: audioElement.currentTime });
    });

    audioElement.addEventListener("loadedmetadata", () => {
      set({ duration: audioElement.duration });
    });

    audioElement.addEventListener("ended", () => {
      set({ isPlaying: false, isEnded: true });
    });

    set({
      audioContext,
      analyser,
      audioElement,
      source,
      currentSongId: songId,
      audioUrl,
      isEnded: false,
    });
  },

  play: async () => {
    const { audioElement, audioContext } = get();
    if (audioElement && audioContext) {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      await audioElement.play();
      set({ isPlaying: true, isEnded: false });
    }
  },

  pause: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      set({ isPlaying: false });
    }
  },

  seek: (time: number) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.currentTime = time;
      set({ currentTime: time });
    }
  },

  cleanup: () => {
    const state = get();
    if (state.audioElement) {
      state.audioElement.pause();
      state.audioElement.src = "";
      state.audioElement.load();
    }
    if (state.audioContext) {
      state.audioContext.close();
    }
    set({
      audioContext: null,
      analyser: null,
      audioElement: null,
      source: null,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      currentSongId: null,
      audioUrl: null,
      isEnded: false,
    });
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsEnded: (isEnded) => set({ isEnded }),
}));

export default useAudioWaveStore;
