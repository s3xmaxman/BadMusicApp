"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/hooks/auth/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import uploadFileToR2 from "@/actions/uploadFileToR2";
import { toast } from "react-hot-toast";

const AccountContent = () => {
  const { userDetails: data } = useUser();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setUserData(data);

      if (data?.avatar_url) {
        setImageUrl(data.avatar_url);
      }
    };

    if (!userData) {
      fetchUserData();
    }
  }, [data, userData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("画像を選択してください");
      return;
    }

    try {
      const uploadedImageUrl = await uploadFileToR2({
        file: selectedImage,
        bucketName: "image",
        fileType: "image",
        fileNamePrefix: `avatar-${userData?.id}`,
      });

      if (!uploadedImageUrl) {
        toast.error("画像のアップロードに失敗しました");
        return;
      }

      // Supabaseのusersテーブルのavatar_urlを更新
      const { error } = await supabaseClient
        .from("users")
        .update({ avatar_url: uploadedImageUrl })
        .eq("id", userData?.id);

      if (error) {
        toast.error("アバターURLの更新に失敗しました");
        console.error("Supabase update error:", error);
        return;
      }

      toast.success("アバター画像を更新しました");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました");
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* アカウント情報 */}
        <Card className="bg-neutral-900/50 backdrop-blur border border-neutral-800 shadow-lg hover:border-neutral-700 transition duration-300">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="アバター"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <User className="w-6 h-6 text-purple-500" />
              )}
            </div>
            <CardTitle className="text-xl font-bold text-white">
              アカウント情報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-neutral-400">ユーザー名</p>
                <p className="text-white font-medium px-3 py-2 bg-neutral-800/50 rounded-md">
                  {userData?.full_name}
                </p>
              </div>
              {/* 画像アップロード関連のUI */}
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-neutral-400">アバター画像</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-neutral-400"
                />
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300"
                >
                  アップロード
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountContent;
