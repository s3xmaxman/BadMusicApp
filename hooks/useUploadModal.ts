import { create } from "zustand";

interface UploadModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * アップロードモーダルの状態を管理するカスタムフック
 *
 * @returns {Object} アップロードモーダルの状態と操作関数
 * @property {boolean} isOpen - モーダルが開いているかどうか
 * @property {function} onOpen - モーダルを開く関数
 * @property {function} onClose - モーダルを閉じる関数
 */
export const useUploadModal = create<UploadModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useUploadModal;
