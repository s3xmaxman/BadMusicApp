import { create } from "zustand";

interface SpotlightState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSpotlightModal = create<SpotlightState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSpotlightModal;
