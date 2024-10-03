import { Subscription, UserDetails } from "@/types";
import { useEffect, useState, createContext, useContext } from "react";
import {
  useUser as useSupaUser,
  useSessionContext,
  User,
} from "@supabase/auth-helpers-react";

// ユーザーコンテキストの型を定義
type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

// ユーザーコンテキストを作成
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any; // プロパティの型を定義
}

// ユーザーコンテキストプロバイダーを作成
export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext(); // セッション情報とSupabaseクライアントを取得
  const user = useSupaUser(); // ユーザー情報を取得
  const accessToken = session?.access_token ?? null; // アクセストークンを取得
  const [isLoadingData, setIsloadingData] = useState(false); // ローディング状態のステートとその更新関数を定義
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); // ユーザーの詳細情報のステートとその更新関数を定義
  const [subscription, setSubscription] = useState<Subscription | null>(null); // サブスクリプションのステートとその更新関数を定義

  // ユーザーの詳細情報を取得する関数
  const getUserDetails = () => supabase.from("users").select("*").single();
  // サブスクリプションの詳細情報を取得する関数
  const getSubscription = () =>
    supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single();

  // ユーザーとサブスクリプションの詳細情報を取得する処理
  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
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
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription,
  };

  return <UserContext.Provider value={value} {...props} />; // ユーザーコンテキストを提供
};

// ユーザーコンテキストを取得するカスタムフック
export const useUser = () => {
  const context = useContext(UserContext); // ユーザーコンテキストを取得
  if (context === undefined) {
    throw new Error("useUser must be used within a MyUserContextProvider");
  }
  return context;
};
