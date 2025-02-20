import { useEffect, useState } from "react";

// 値のデバウンスを行うカスタムフック
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // タイマーを設定し、指定された遅延時間後に値を更新する
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    // クリーンアップ関数を返し、コンポーネントがアンマウントされるときにタイマーをクリアする
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
