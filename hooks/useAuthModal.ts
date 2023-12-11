import { create } from "zustand";

// AuthModalの状態を管理するインターフェース
interface AuthModalStore {
  isOpen: boolean; // モーダルが開いているかどうかを示すフラグ
  onOpen: () => void; // モーダルを開くための関数
  onClose: () => void; // モーダルを閉じるための関数
};

// Zustandフックを使用してAuthModalの状態を管理するカスタムフック
export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false, // モーダルの初期状態は閉じている
  onOpen: () => set({ isOpen: true }), // モーダルを開く関数
  onClose: () => set({ isOpen: false }), // モーダルを閉じる関数
}));

export default useAuthModal; // useAuthModalフックをデフォルトエクスポート