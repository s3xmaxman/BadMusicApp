import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isRepeating: boolean;
  isShuffling: boolean;
  shuffledIds: string[];
  isLoading: boolean;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  reset: () => void;
  getNextSongId: () => string | undefined;
  getPreviousSongId: () => string | undefined;
  setIsLoading: (isLoading: boolean) => void;
  play: () => void;
}

/**
 * プレイヤーの状態を管理するカスタムフック
 *
 * @returns {Object} プレイヤーの状態と操作関数
 * @property {string[]} ids - 再生リストの曲ID
 * @property {string|undefined} activeId - 現在再生中の曲ID
 * @property {boolean} isRepeating - リピート再生中かどうか
 * @property {boolean} isShuffling - シャッフル再生中かどうか
 * @property {string[]} shuffledIds - シャッフルされた曲IDリスト
 * @property {boolean} isLoading - ローディング中かどうか
 * @property {function} setId - 現在の曲IDを設定する関数
 * @property {function} setIds - 再生リストを設定する関数
 * @property {function} toggleRepeat - リピート切り替え関数
 * @property {function} toggleShuffle - シャッフル切り替え関数
 * @property {function} reset - プレイヤーをリセットする関数
 * @property {function} getNextSongId - 次の曲IDを取得する関数
 * @property {function} getPreviousSongId - 前の曲IDを取得する関数
 * @property {function} setIsLoading - ローディング状態を設定する関数
 * @property {function} play - 再生を開始する関数
 */
const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: undefined,
  isRepeating: false,
  isShuffling: false,
  shuffledIds: [],
  isLoading: false,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids }),
  toggleRepeat: () => set((state) => ({ isRepeating: !state.isRepeating })),
  toggleShuffle: () =>
    set((state) => {
      let newShuffledIds = [...state.ids];
      if (!state.isShuffling) {
        for (let i = newShuffledIds.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newShuffledIds[i], newShuffledIds[j]] = [
            newShuffledIds[j],
            newShuffledIds[i],
          ];
        }
      }
      return {
        isShuffling: !state.isShuffling,
        shuffledIds: newShuffledIds,
      };
    }),
  reset: () =>
    set({
      ids: [],
      activeId: undefined,
      isRepeating: false,
      isShuffling: false,
      isLoading: false,
    }),
  getNextSongId: () => {
    const { ids, activeId, isShuffling, isRepeating, shuffledIds } = get();
    if (ids.length === 0) {
      return undefined;
    }

    const currentIndex = ids.findIndex((id) => id === activeId);
    if (currentIndex === -1) {
      return undefined;
    }

    if (isRepeating) {
      return activeId;
    }

    let nextIndex: number;

    if (isShuffling) {
      nextIndex = (currentIndex + 1) % shuffledIds.length;
      return shuffledIds[nextIndex];
    } else {
      nextIndex = (currentIndex + 1) % ids.length;
      return ids[nextIndex];
    }
  },
  getPreviousSongId: () => {
    const { ids, activeId, isShuffling, isRepeating, shuffledIds } = get();
    if (ids.length === 0) {
      return undefined;
    }

    const currentIndex = ids.findIndex((id) => id === activeId);
    if (currentIndex === -1) {
      return undefined;
    }

    if (isRepeating) {
      return activeId;
    }

    let prevIndex: number;
    if (isShuffling) {
      prevIndex = (currentIndex - 1 + shuffledIds.length) % shuffledIds.length;
      return shuffledIds[prevIndex];
    } else {
      prevIndex = (currentIndex - 1 + ids.length) % ids.length;
    }

    return ids[prevIndex];
  },
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  play: () => set({ isLoading: true }),
}));

export default usePlayer;
