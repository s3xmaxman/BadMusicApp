import { Subscription, UserDetails } from "@/types";
import { useEffect, useState, createContext, useContext } from "react";
import {
  useUser as useSupaUser,
  useSessionContext,
  User,
} from "@supabase/auth-helpers-react";

interface SunoCredits {
  credits_left: number;
  period: string;
  monthly_limit: number;
  monthly_usage: number;
}

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
  creditsLeft: number | null;
  fetchCredits: () => void;
};

/**
 * ユーザーコンテキストを作成
 */
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

/**
 * ユーザーコンテキストプロバイダーコンポーネント
 *
 * @param {Props} props - プロパティ
 * @returns {JSX.Element} ユーザーコンテキストプロバイダー
 */
export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);

  const getUserDetails = () => supabase.from("users").select("*").single();
  const getSubscription = () =>
    supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single();

  // クレジット情報を取得する関数
  const fetchCredits = async () => {
    try {
      // const response = await fetch("/api/suno/get_limit");
      // if (!response.ok) {
      //   throw new Error("Failed to fetch credits");
      // }
      // const data: SunoCredits = await response.json();
      // setCreditsLeft(data.credits_left);
    } catch (error) {
      console.error("Failed to fetch credits:", error);
      // エラーの場合でも既存の値を保持
    }
  };

  // ユーザー情報とサブスクリプション情報の取得
  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsloadingData(true);

      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          if (userDetailsPromise.status === "fulfilled") {
            setUserDetails(userDetailsPromise.value.data as UserDetails);
          }

          if (subscriptionPromise.status === "fulfilled") {
            setSubscription(subscriptionPromise.value.data as Subscription);
          }

          setIsloadingData(false);
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
      setCreditsLeft(null);
      setIsloadingData(false);
    }
  }, [user, isLoadingUser]);

  // クレジット情報の定期的な更新
  useEffect(() => {
    if (user) {
      // 初回のクレジット情報取得
      fetchCredits();

      // 60分ごとにクレジット情報を更新
      const intervalId = setInterval(fetchCredits, 10 * 60 * 6000);

      // クリーンアップ関数
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription,
    creditsLeft,
    fetchCredits,
  };

  return <UserContext.Provider value={value} {...props} />;
};

/**
 * ユーザーコンテキストを使用するカスタムフック
 *
 * @returns {UserContextType} ユーザーコンテキスト
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a MyUserContextProvider");
  }
  return context;
};
