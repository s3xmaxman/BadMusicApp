import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { ProductWithPrice } from "@/types";

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  // サーバーコンポーネントクライアントを作成し、クッキーを渡します。
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // Supabaseから「products」テーブルのアクティブな製品と価格を取得します。
  const { data, error } = await supabase
    .from("products") // 「products」テーブルを指定
    .select("*, prices(*)") // 製品情報と関連する価格情報を選択
    .eq("active", true) // アクティブな製品のみを抽出
    .eq("prices.active", true) // 価格の中でもアクティブなものに絞り込む
    .order("metadata->index") // メタデータ内のindexに沿って並び替え
    .order("unit_amount", { foreignTable: "prices" }); // 価格テーブルにおいて単位金額で並び替え

  // エラーが発生した場合はログ出力します。
  if (error) {
    console.log(error.message);
  }

  // 取得したデータ、またはエラーがあった場合は空の配列を返却します。
  return (data as ProductWithPrice[]) || [];
};

// この関数をデフォルトエクスポートします。
export default getActiveProductsWithPrices;
