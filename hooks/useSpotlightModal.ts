import { create } from "zustand";

interface SpotlightItem {
  id: number;
  video_path: string;
  title: string;
  author: string;
  genre: string;
  description: string;
}

interface SpotlightState {
  isOpen: boolean;
  selectedItem: SpotlightItem | null;
  onOpen: (item: SpotlightItem) => void;
  onClose: () => void;
}

const useSpotlightModal = create<SpotlightState>((set) => ({
  isOpen: false,
  selectedItem: null,
  onOpen: (item: SpotlightItem) => set({ isOpen: true, selectedItem: item }),
  onClose: () => set({ isOpen: false, selectedItem: null }),
}));

export default useSpotlightModal;
