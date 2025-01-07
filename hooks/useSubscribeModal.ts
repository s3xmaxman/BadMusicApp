import { create } from "zustand";

interface SubscribeModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * サブスクリプションモーダルの状態を管理するカスタムフック
 *
 * @returns {Object} サブスクリプションモーダルの状態と操作関数
 * @property {boolean} isOpen - モーダルが開いているかどうか
 * @property {function} onOpen - モーダルを開く関数
 * @property {function} onClose - モーダルを閉じる関数
 */
const useSubscribeModal = create<SubscribeModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSubscribeModal;
