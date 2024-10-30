"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { postData } from "@/libs/helpers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SunoCookieInput from "@/components/SunoCookieInput";

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
      <Card className="bg-neutral-900 border border-neutral-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            サブスクリプション状況
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!subscription ? (
            <div className="flex flex-col gap-y-4">
              <p className="text-neutral-400">Subscribeされていません</p>
              <Button onClick={subscribeModal.onOpen} className="w-[300px]">
                Subscribe
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-y-4">
              <p className="text-neutral-400">
                お客様は
                <span className="text-white font-medium">
                  {subscription?.prices?.products?.name}
                </span>
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
        </CardContent>
      </Card>

      {/* クレジット情報 */}
      <Card className="bg-neutral-900 border border-neutral-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            利用可能なクレジット
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p className="text-neutral-400">残りクレジット</p>
              <p className="text-2xl font-bold">
                {creditsLeft !== null ? (
                  <>
                    <span className="text-primary">{creditsLeft}</span>
                    <span className="text-sm text-neutral-500 ml-1">
                      credits
                    </span>
                  </>
                ) : (
                  <span className="text-neutral-400">読み込み中...</span>
                )}
              </p>
            </div>
            <p className="text-sm text-neutral-500 mt-2">
              クレジットは音楽生成に使用され、毎月更新されます
            </p>
          </div>
        </CardContent>
      </Card>

      <SunoCookieInput />

      {/* アカウント情報 */}
      <Card className="bg-neutral-900 border border-neutral-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            アカウント情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p className="text-neutral-400">メールアドレス</p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-neutral-400">最終ログイン</p>
              <p className="text-white font-medium">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString("ja-JP")
                  : "情報なし"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountContent;
