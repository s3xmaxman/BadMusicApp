import { Price } from "@/types";

export const getURL = () => {
  // 環境変数NEXT_PUBLIC_SITE_URL、NEXT_PUBLIC_VERCEL_URLのどちらかを使用してURLを設定します。
  // どちらも設定されていない場合は、'http://localhost:3000'をデフォルトURLとして使用します。
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";

  // URLが'http'または'https'で始まっていない場合は、'https://'を追加します。
  url = url.includes("http") ? url : `https://${url}`;
  // URLの最後がスラッシュ('/')で終わっていない場合は、スラッシュを追加します。
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

// URLにデータをPOSTリクエストで送信する非同期関数です。
export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log("POST REQUEST", url, data);

  // fetchを使用して、指定されたURLに対してPOSTリクエストを送信します。
  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }), // ヘッダーにコンテンツタイプをJSONとして設定
    credentials: "same-origin", // クレデンシャルポリシーを同一オリジンに設定
    body: JSON.stringify(data), // リクエストボディにデータをJSON形式で設定
  });

  // レスポンスが正常でない場合は、エラーをコンソールに出力し、例外をスローします。
  if (!res.ok) {
    console.log("Error in postData", { url, data, res });
    throw new Error(res.statusText);
  }

  // レスポンスボディをJSONとして返します。
  return res.json();
};

// 引数で渡された秒数を日時に変換する関数
export const toDateTime = (secs: number) => {
  // 1970年1月1日 00:30:00を基準にして、引数で渡された秒数を加算する
  var t = new Date("1970-01-01T00:30:00Z");
  t.setSeconds(secs);
  return t;
};

// 引数で渡された文字列をランダムな文字列に変換する関数
function generateRandomString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// 引数で渡された文字列を正規化する関数
export const sanitizeTitle = (title: string) => {
  const regex = /^[a-zA-Z0-9-_]+$/;
  if (!regex.test(title)) {
    return generateRandomString(10);
  }
};

const MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB

/**
 * キャッシュのサイズを管理し、上限を超えた場合に古いエントリを削除する関数。
 * @param {Cache} cache - 管理対象のキャッシュオブジェクト。
 */
export async function manageCacheSize(cache: Cache) {
  // キャッシュの全てのキーを取得
  const keys = await cache.keys();
  let cacheSize = 0;
  const cacheEntries: { key: Request; size: number; date: Date }[] = [];

  // 各キーに対応するキャッシュエントリを処理
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const blob = await response.clone().blob();
      cacheSize += blob.size;
      const cacheDate = new Date(response.headers.get("x-cache-date") || "");
      cacheEntries.push({ key, size: blob.size, date: cacheDate });
    }
  }

  // キャッシュサイズが上限を超えている場合、古いエントリを削除
  if (cacheSize > MAX_CACHE_SIZE) {
    console.log(
      "キャッシュサイズが上限を超えています。古いエントリを削除します。"
    );
    cacheEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

    while (cacheSize > MAX_CACHE_SIZE && cacheEntries.length > 0) {
      const oldestEntry = cacheEntries.shift();
      if (oldestEntry) {
        await cache.delete(oldestEntry.key);
        cacheSize -= oldestEntry.size;
        console.log(
          "キャッシュからエントリを削除しました:",
          oldestEntry.key.url
        );
      }
    }
  }
}

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url, {
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    const blobURL = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobURL);
  } catch (error) {
    console.error("ダウンロードに失敗しました:", error);
    // TODO: ユーザーへのフィードバックを追加
  }
};
