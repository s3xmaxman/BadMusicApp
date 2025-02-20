import { create } from "zustand";

interface SpotLightUploadModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSpotLightUploadModal = create<SpotLightUploadModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSpotLightUploadModal;
