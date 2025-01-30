import { create } from "zustand";

// AuthModalの状態を管理するインターフェース
interface AuthModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

// Zustandフックを使用してAuthModalの状態を管理するカスタムフック
export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useAuthModal;
