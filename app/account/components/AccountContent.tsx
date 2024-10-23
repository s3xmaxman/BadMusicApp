"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { postData } from "@/libs/helpers";
import { Card } from "@/components/ui/card";

const AccountContent = () => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user, creditsLeft } = useUser();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: "/api/create-portal-link",
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="mb-7 px-6 space-y-6">
      {/* サブスクリプション情報 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">サブスクリプション状況</h2>
        {!subscription && (
          <div className="flex flex-col gap-y-4">
            <p>Subscribeされていません</p>
            <Button onClick={subscribeModal.onOpen} className="w-[300px]">
              Subscribe
            </Button>
          </div>
        )}
        {subscription && (
          <div className="flex flex-col gap-y-4">
            <p>
              お客様は
              <b> {subscription?.prices?.products?.name} </b>
              に加入しています
            </p>
            <Button
              disabled={loading || isLoading}
              onClick={redirectToCustomerPortal}
              className="w-[300px]"
            >
              カスタマーポータルを開く
            </Button>
          </div>
        )}
      </Card>

      {/* クレジット情報 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">利用可能なクレジット</h2>
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">残りクレジット</p>
            <p className="text-2xl font-bold">
              {creditsLeft !== null ? (
                <>
                  <span className="text-primary">{creditsLeft}</span>
                  <span className="text-sm text-gray-500 ml-1">credits</span>
                </>
              ) : (
                <span className="text-gray-400">読み込み中...</span>
              )}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            クレジットは音声生成に使用され、毎月更新されます
          </p>
        </div>
      </Card>

      {/* アカウント情報 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">アカウント情報</h2>
        <div className="flex flex-col gap-y-2">
          <p className="text-gray-600">
            メールアドレス: <span className="font-medium">{user?.email}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            最終ログイン:{" "}
            {user?.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString("ja-JP")
              : "情報なし"}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AccountContent;
