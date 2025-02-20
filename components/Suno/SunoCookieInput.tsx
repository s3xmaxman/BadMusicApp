"use client";
import { useState } from "react";
import { useUser } from "@/hooks/auth/useUser";
import Button from "../Button";
import { toast } from "react-hot-toast";
import Input from "../Input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SunoCookieInput = () => {
  const { user } = useUser();
  const [sunoCookie, setSunoCookie] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsAlertOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setIsLoading(true);

      const response = await fetch("/api/suno/cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sunoCookie }),
      });

      if (!response.ok) {
        throw new Error("Failed to set suno cookie");
      }

      toast.success("SUNO cookieが正常に保存されました");
      setSunoCookie("");
    } catch (error) {
      toast.error("SUNO cookieの保存に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);

      const response = await fetch("/api/suno/cookie", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete suno cookie");
      }

      toast.success("SUNO cookieが正常に削除されました");
      setSunoCookie("");
    } catch (error) {
      toast.error("SUNO cookieの削除に失敗しました");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="password"
          value={sunoCookie}
          onChange={(e) => setSunoCookie(e.target.value)}
          placeholder="SUNO Cookieを入力してください"
          className="w-full bg-neutral-800/50 border-neutral-700 focus:border-blue-500 transition-colors text-white placeholder-neutral-500"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-neutral-700 "
      >
        {isLoading ? "保存中..." : "保存"}
      </Button>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            type="button"
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-neutral-700 text-white"
          >
            {isDeleting ? "削除中..." : "削除"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>SUNO Cookieを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。SUNO
              Cookieを削除すると、再度設定するまでSUNO
              AIの機能が使用できなくなります。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
};

export default SunoCookieInput;
