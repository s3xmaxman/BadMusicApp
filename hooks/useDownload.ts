import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useDownload = (path: string) => {
  const supabase = useSupabaseClient();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const downloadFile = async () => {
      setLoading(true);
      try {
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
