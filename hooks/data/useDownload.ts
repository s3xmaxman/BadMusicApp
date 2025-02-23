import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

/**
 * Supabase Storageからファイルをダウンロードするためのカスタムフック
 *
 * @param {string} path - ダウンロードするファイルのパス
 * @returns {Object} ダウンロード状態と結果を含むオブジェクト
 * @property {string|null} fileUrl - ダウンロードしたファイルのURL
 * @property {boolean} loading - ダウンロード中の状態
 * @property {string|null} error - エラーメッセージ
 *
 */
const useDownload = (path: string) => {
  const supabase = useSupabaseClient();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const downloadFile = async () => {
      setLoading(true);
      try {
        if (path.startsWith("http://") || path.startsWith("https://")) {
          setFileUrl(path);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.storage
          .from("songs")
          .download(path);

        if (error) {
          setError(error.message);
          return;
        }

        if (data) {
          const url = URL.createObjectURL(data);
          setFileUrl(url);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    downloadFile();
  }, [path]);

  return { fileUrl, loading, error };
};

export default useDownload;
