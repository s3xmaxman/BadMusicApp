import { create } from "zustand";

interface SunoModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSunoModal = create<SunoModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSunoModal;
