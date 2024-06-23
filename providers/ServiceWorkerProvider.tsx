/**
 * ServiceWorkerProviderコンポーネント
 *
 * このコンポーネントは、子コンポーネントをラップし、サービスワーカーを登録します。
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {React.ReactNode} props.children - 子コンポーネント
 *
 * @returns {JSX.Element} 子コンポーネントをラップしたJSX要素
 * TODO: オフライン再生に対応する予定
 * TODO: service-worker.tsを作成する予定
 */
"use client";
import { useEffect } from "react";

const ServiceWorkerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/service-worker.ts"
          );
          console.log(
            "Service Workerが登録されました。スコープ:",
            registration.scope
          );
        } catch (error) {
          console.error("Service Workerの登録に失敗しました:", error);
          alert(
            "Service Workerの登録に失敗しました。詳細はコンソールを確認してください。"
          );
        }
      }
    };

    registerServiceWorker();
  }, []);

  return <>{children}</>;
};

export default ServiceWorkerProvider;
