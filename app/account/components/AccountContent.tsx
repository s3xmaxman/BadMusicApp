"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Pencil, Camera, Upload, X } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/hooks/auth/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import uploadFileToR2 from "@/actions/uploadFileToR2";
import { toast } from "react-hot-toast";
import Input from "@/components/Input";
import deleteFileFromR2 from "@/actions/deleteFileFromR2";
import Button from "@/components/Button";

const AccountContent = () => {
  const { userDetails: data } = useUser();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setUserData(data);
      setNewFullName(data?.full_name || "");
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const clearSelectedImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(imageUrl || "");
      setSelectedImage(null);
      setImageUrl(data?.avatar_url || null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("画像を選択してください");
      return;
    }

    try {
      setIsLoading(true);
      toast.loading("アップロード中...");

      // 既存の画像を削除（もしあれば）
      if (userData?.avatar_url) {
        try {
          const filePath = userData.avatar_url.split("/").pop();

          await deleteFileFromR2({
            bucketName: "image",
            filePath: filePath!,
          });
        } catch (error) {
          toast.dismiss();
          toast.error("画像の削除に失敗しました");
          console.error("画像の削除に失敗しました", error);
        }
      }

      const uploadedImageUrl = await uploadFileToR2({
        file: selectedImage,
        bucketName: "image",
        fileType: "image",
        fileNamePrefix: `avatar-${userData?.id}`,
      });

      if (!uploadedImageUrl) {
        toast.dismiss();
        toast.error("画像のアップロードに失敗しました");
        return;
      }

      const { error } = await supabaseClient
        .from("users")
        .update({ avatar_url: uploadedImageUrl })
        .eq("id", userData?.id);

      if (error) {
        toast.dismiss();
        toast.error("アバターURLの更新に失敗しました");
        console.error("Supabase update error:", error);
        return;
      }

      toast.dismiss();
      toast.success("アバター画像を更新しました");
      setUserData({ ...userData, avatar_url: uploadedImageUrl });
      router.refresh();
    } catch (error) {
      toast.dismiss();
      toast.error("エラーが発生しました");
      console.error(error);
    }

    setIsLoading(false);
  };

  const handleNameChange = async () => {
    if (!newFullName.trim()) {
      toast.error("名前を入力してください");
      return;
    }

    try {
      toast.loading("更新中...");

      const { error } = await supabaseClient
        .from("users")
        .update({ full_name: newFullName })
        .eq("id", userData?.id);

      if (error) {
        toast.dismiss();
        toast.error("名前の更新に失敗しました");
        console.error("Supabase update error:", error);
        return;
      }

      toast.dismiss();
      toast.success("名前を更新しました");
      setIsEditingName(false);
      setUserData({ ...userData, full_name: newFullName });
      router.refresh();
    } catch (error) {
      toast.dismiss();
      toast.error("エラーが発生しました");
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="bg-neutral-900/80 backdrop-blur-xl border border-purple-900/30 shadow-xl hover:shadow-purple-900/10 transition duration-500">
        <div className="flex flex-col md:flex-row">
          {/* プロフィール画像エリア */}
          <div className="w-full md:w-1/3 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800">
            <div
              className={`relative group w-40 h-40 rounded-full overflow-hidden border-4 ${
                dragActive ? "border-purple-500" : "border-purple-900/50"
              } transition duration-300`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="アバター"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-neutral-800 text-purple-400">
                  <User className="w-20 h-20" />
                </div>
              )}

              {/* オーバーレイ */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer p-2 rounded-full bg-purple-500/80 hover:bg-purple-500 transition duration-300"
                >
                  <Camera className="w-6 h-6 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* ファイルアップロード情報 */}
            <div className="mt-4 w-full flex flex-col items-center">
              {selectedImage && (
                <div className="w-full mt-2 flex items-center justify-between bg-neutral-800/50 p-2 rounded-md">
                  <span className="text-sm text-neutral-300 truncate max-w-[140px]">
                    {selectedImage.name}
                  </span>
                  <button
                    onClick={clearSelectedImage}
                    className="text-neutral-400 hover:text-red-400 transition duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {selectedImage && (
                <Button
                  disabled={isLoading}
                  onClick={handleUpload}
                  className="mt-4 w-full"
                  type="submit"
                >
                  {isLoading ? "アップロード中..." : "アップロード"}
                </Button>
              )}

              <p className="mt-4 text-xs text-neutral-500 text-center">
                ドラッグ＆ドロップでも画像をアップロードできます
              </p>
            </div>
          </div>

          {/* ユーザー情報エリア */}
          <div className="w-full md:w-2/3">
            <CardHeader className="relative pb-2">
              <CardTitle className="text-2xl font-bold text-white flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                  アカウント情報
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-8">
                {/* ユーザー名セクション */}
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                      <User size={14} className="text-purple-400" />
                      ユーザー名
                    </p>
                    {/* 編集ボタン */}
                    {!isEditingName && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-purple-400 hover:text-purple-300 transition duration-300 flex items-center gap-1"
                      >
                        <Pencil size={14} />
                        <span className="text-xs">編集</span>
                      </button>
                    )}
                  </div>

                  {/* 名前表示/編集 */}
                  {isEditingName ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        className="bg-neutral-800/70 border-neutral-700 focus:border-purple-500 text-white"
                        placeholder="新しい名前"
                      />
                      <button
                        onClick={handleNameChange}
                        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300 shadow-md"
                      >
                        保存
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-neutral-800/40 backdrop-blur-sm rounded-lg border border-neutral-800/80 hover:border-neutral-700/80 transition duration-300">
                      <p className="text-white font-medium">
                        {userData?.full_name || "名前未設定"}
                      </p>
                    </div>
                  )}
                </div>

                {/* その他のユーザー情報（必要に応じて拡張可能） */}
                <div className="flex flex-col space-y-3">
                  <p className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-400"
                    >
                      <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
                      <polyline points="15,9 18,9 18,11" />
                      <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0" />
                      <line x1="6" x2="7" y1="10" y2="10" />
                    </svg>
                    メールアドレス
                  </p>
                  <div className="flex items-center px-4 py-3 bg-neutral-800/40 backdrop-blur-sm rounded-lg border border-neutral-800/80">
                    <p className="text-neutral-300 font-medium">
                      {userData?.email || "メールアドレス未設定"}
                    </p>
                  </div>
                </div>

                {/* アカウント作成日など追加情報（オプション） */}
                <div className="flex flex-col space-y-1 mt-8">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent"></div>
                  <p className="text-xs text-neutral-500 text-right">
                    アカウント作成日:{" "}
                    {userData?.created_at
                      ? new Date(userData.created_at).toLocaleDateString(
                          "ja-JP"
                        )
                      : "不明"}
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountContent;
