import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isRepeating: boolean;
  isShuffling: boolean;
  shuffledIds: string[];
  isLoading: boolean;
  isSuno?: boolean;
  setId: (id: string, isSuno?: boolean) => void;
  setIds: (ids: string[], isSuno?: boolean) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  reset: () => void;
  getNextSongId: () => string | undefined;
  getPreviousSongId: () => string | undefined;
  setIsLoading: (isLoading: boolean) => void;
  play: () => void;
}

const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: undefined,
  isRepeating: false,
  isShuffling: false,
  shuffledIds: [],
  isLoading: false,
  setId: (id: string, isSuno: boolean = false) => set({ activeId: id, isSuno }),
  setIds: (ids: string[], isSuno: boolean = false) => set({ ids, isSuno }),
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
