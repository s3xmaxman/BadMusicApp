"use client";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { set } from "react-hook-form";
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
    <Card className="bg-neutral-900 border border-neutral-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          SUNO Cookie設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={sunoCookie}
            onChange={(e) => setSunoCookie(e.target.value)}
            placeholder="SUNO Cookieを入力してください"
            className="bg-neutral-800 text-white border-neutral-700"
          />
          <Button
            disabled={isLoading || !sunoCookie}
            type="submit"
            className="w-full"
          >
            {isLoading ? "保存中..." : "保存"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SunoCookieInput;
