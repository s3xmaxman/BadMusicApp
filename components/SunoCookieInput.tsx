"use client";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import Button from "./Button";
import { toast } from "react-hot-toast";
import Input from "./Input";

const SunoCookieInput = () => {
  const { user } = useUser();
  const [sunoCookie, setSunoCookie] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        disabled={isLoading || !sunoCookie}
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-700"
      >
        {isLoading ? "保存中..." : "保存"}
      </Button>
    </form>
  );
};

export default SunoCookieInput;
