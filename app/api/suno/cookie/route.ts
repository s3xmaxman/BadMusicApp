import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Encryption } from "@/libs/encryption";

/**
 * SUNOクッキーを保存するPOSTリクエストハンドラ
 * @param request - リクエストオブジェクト
 * @returns
 *   - 成功時: 成功メッセージを含むJSONレスポンス
 *   - エラー時: 適切なエラーレスポンス
 */
export async function POST(request: Request) {
  try {
    // Supabaseクライアントの初期化
    const supabase = createRouteHandlerClient({
      cookies,
    });

    // 現在のセッションを取得
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 認証チェック
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // リクエストボディからSUNOクッキーを取得
    const { sunoCookie } = await request.json();

    // クッキーのバリデーション
    if (!sunoCookie || typeof sunoCookie !== "string") {
      return new NextResponse("Invalid suno cookie", { status: 400 });
    }

    // クッキーを暗号化
    const encryptedCookie = await Encryption.encrypt(sunoCookie);

    // ユーザーデータを更新
    const { error: updateError } = await supabase
      .from("users")
      .update({ suno_cookie: encryptedCookie })
      .eq("id", session.user.id);

    if (updateError) {
      console.error(updateError);
      return new NextResponse("Failed to update suno cookie", { status: 500 });
    }

    return NextResponse.json({
      message: "Successfully saved SUNO cookie",
    });
  } catch (error) {
    console.error("Error in SUNO cookie API:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * SUNOクッキーを削除するDELETEリクエストハンドラ
 * @returns
 *   - 成功時: 成功メッセージを含むJSONレスポンス
 *   - エラー時: 適切なエラーレスポンス
 */
export async function DELETE() {
  try {
    // Supabaseクライアントの初期化
    const supabase = createRouteHandlerClient({
      cookies,
    });

    // 現在のユーザーを取得
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // 認証チェック
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ユーザーデータからSUNOクッキーを削除
    const { error: deleteError } = await supabase
      .from("users")
      .update({ suno_cookie: null })
      .eq("id", user.id);

    if (deleteError) {
      console.error(deleteError);
      return new NextResponse("Failed to delete suno cookie", { status: 500 });
    }

    return NextResponse.json({
      message: "Successfully deleted SUNO cookie",
    });
  } catch (error) {
    console.error("Error in SUNO cookie API:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
