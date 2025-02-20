import { Spotlight } from "@/types";
import { create } from "zustand";

interface SpotlightState {
  isOpen: boolean;
  selectedItem: Spotlight | null;
  onOpen: (item: Spotlight) => void;
  onClose: () => void;
}

const useSpotlightModal = create<SpotlightState>((set) => ({
  isOpen: false,
  selectedItem: null,
  onOpen: (item: Spotlight) => set({ isOpen: true, selectedItem: item }),
  onClose: () => set({ isOpen: false, selectedItem: null }),
}));

export default useSpotlightModal;
