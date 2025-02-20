import { create } from "zustand";

interface SunoModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Sunoモーダルの状態を管理するカスタムフック
 *
 * @returns {Object} Sunoモーダルの状態と操作関数
 * @property {boolean} isOpen - モーダルが開いているかどうか
 * @property {function} onOpen - モーダルを開く関数
 * @property {function} onClose - モーダルを閉じる関数
 */
export const useSunoModal = create<SunoModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSunoModal;
