import { create } from "zustand";

interface MobilePlayerStore {
  isMobilePlayer: boolean;
  toggleMobilePlayer: () => void;
}

const useMobilePlayer = create<MobilePlayerStore>((set) => ({
  isMobilePlayer: false,
  toggleMobilePlayer: () =>
    set((state) => ({ isMobilePlayer: !state.isMobilePlayer })),
}));

export default useMobilePlayer;
