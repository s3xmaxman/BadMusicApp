import { create } from "zustand";

interface PlaylistModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * プレイリストモーダルの状態を管理するカスタムフック
 *
 * @returns {Object} プレイリストモーダルの状態と操作関数
 * @property {boolean} isOpen - モーダルが開いているかどうか
 * @property {function} onOpen - モーダルを開く関数
 * @property {function} onClose - モーダルを閉じる関数
 */
const usePlaylistModal = create<PlaylistModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePlaylistModal;
