import { create } from "zustand";

// PlayerStoreインターフェースの定義
interface PlayerStore {
  ids: string[]; // 再生リストのID配列
  activeId?: string; // 現在アクティブな曲のID
  setId: (id: string) => void; // アクティブな曲のIDを設定する関数
  setIds: (ids: string[]) => void; // 再生リストのID配列を設定する関数
  reset: () => void; // ストアを初期状態にリセットする関数
}

// usePlayerという名前でzustandストアを作成
const usePlayer = create<PlayerStore>((set) => ({
  ids: [], // 初期状態の再生リストID配列は空
  activeId: undefined, // 初期状態のアクティブな曲IDは未定義
  setId: (id: string) => set({ activeId: id }), // アクティブな曲のIDを設定
  setIds: (ids: string[]) => set({ ids }), // 再生リストのID配列を設定
  reset: () => set({ ids: [], activeId: undefined }), // ストアをリセット
}));

// usePlayerをデフォルトエクスポート
export default usePlayer;
