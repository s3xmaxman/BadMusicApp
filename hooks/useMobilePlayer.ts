import { create } from "zustand";

interface MobilePlayerStore {
  isMobilePlayer: boolean;
  toggleMobilePlayer: () => void;
}

/**
 * モバイルプレイヤーの状態を管理するカスタムフック
 *
 * @returns {Object} モバイルプレイヤーの状態と操作関数
 * @property {boolean} isMobilePlayer - モバイルプレイヤーが表示されているかどうか
 * @property {function} toggleMobilePlayer - モバイルプレイヤーの表示状態を切り替える関数
 */
const useMobilePlayer = create<MobilePlayerStore>((set) => ({
  isMobilePlayer: false,
  toggleMobilePlayer: () =>
    set((state) => ({ isMobilePlayer: !state.isMobilePlayer })),
}));

export default useMobilePlayer;
