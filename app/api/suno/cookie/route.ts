// api/suno/cookie/route.ts
import {
  createRouteHandlerClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Encryption } from "@/libs/encryption";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sunoCookie } = await request.json();

    if (!sunoCookie || typeof sunoCookie !== "string") {
      return new NextResponse("Invalid suno cookie", { status: 400 });
    }

    const encryptedCookie = await Encryption.encrypt(sunoCookie);

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

export async function DELETE() {
  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
