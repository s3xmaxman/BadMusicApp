import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isRepeating: boolean;
  isShuffling: boolean;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  reset: () => void;
  getNextSongId: () => string | undefined;
  getPreviousSongId: () => string | undefined;
}

const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: undefined,
  isRepeating: false,
  isShuffling: false,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids }),
  toggleRepeat: () => set((state) => ({ isRepeating: !state.isRepeating })),
  toggleShuffle: () => set((state) => ({ isShuffling: !state.isShuffling })),
  reset: () =>
    set({
      ids: [],
      activeId: undefined,
      isRepeating: false,
      isShuffling: false,
    }),
  getNextSongId: () => {
    const { ids, activeId, isShuffling } = get();
    if (ids.length === 0) {
      return undefined;
    }

    const currentIndex = ids.findIndex((id) => id === activeId);
    if (currentIndex === -1) {
      return undefined;
    }

    let nextIndex: number;
    if (isShuffling) {
      do {
        nextIndex = Math.floor(Math.random() * ids.length);
      } while (nextIndex === currentIndex);
    } else {
      nextIndex = (currentIndex + 1) % ids.length;
    }

    return ids[nextIndex];
  },
  getPreviousSongId: () => {
    const { ids, activeId, isShuffling } = get();
    if (ids.length === 0) {
      return undefined;
    }

    const currentIndex = ids.findIndex((id) => id === activeId);
    if (currentIndex === -1) {
      return undefined;
    }

    let prevIndex: number;
    if (isShuffling) {
      do {
        prevIndex = Math.floor(Math.random() * ids.length);
      } while (prevIndex === currentIndex);
    } else {
      prevIndex = (currentIndex - 1 + ids.length) % ids.length;
    }

    return ids[prevIndex];
  },
}));

export default usePlayer;
