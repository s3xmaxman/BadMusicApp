"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/auth/useUser";
import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/modal/useSubscribeModal";
import { postData } from "@/libs/helpers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CircleSlash, CreditCard, User, Cookie } from "lucide-react";
import SunoCookieInput from "@/components/Suno/SunoCookieInput";

const AccountContent = () => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user } = useUser();
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* サブスクリプション情報 */}
        <Card className="bg-neutral-900/50 backdrop-blur border border-neutral-800 shadow-lg hover:border-neutral-700 transition duration-300">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold text-white">
              サブスクリプション
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!subscription ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-neutral-400">
                  <CircleSlash className="w-4 h-4" />
                  <span>未加入</span>
                </div>
                <Button onClick={subscribeModal.onOpen} className="w-full">
                  サブスクリプションに加入する
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-neutral-400">現在のプラン</p>
                  <p className="text-xl font-bold text-primary">
                    {subscription?.prices?.products?.name}
                  </p>
                </div>
                <Button
                  disabled={loading || isLoading}
                  onClick={redirectToCustomerPortal}
                  className="w-full"
                >
                  プラン設定を変更
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SUNO Cookie設定 */}
        <Card className="bg-neutral-900/50 backdrop-blur border border-neutral-800 shadow-lg hover:border-neutral-700 transition duration-300">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Cookie className="w-6 h-6 text-blue-500" />
            </div>
            <CardTitle className="text-xl font-bold text-white">
              SUNO設定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SunoCookieInput />
          </CardContent>
        </Card>

        {/* アカウント情報 */}
        <Card className="bg-neutral-900/50 backdrop-blur border border-neutral-800 shadow-lg hover:border-neutral-700 transition duration-300">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <User className="w-6 h-6 text-purple-500" />
            </div>
            <CardTitle className="text-xl font-bold text-white">
              アカウント情報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-neutral-400">メールアドレス</p>
                <p className="text-white font-medium px-3 py-2 bg-neutral-800/50 rounded-md">
                  {user?.email}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-neutral-400">最終ログイン</p>
                <p className="text-white font-medium px-3 py-2 bg-neutral-800/50 rounded-md">
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString("ja-JP")
                    : "情報なし"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountContent;
