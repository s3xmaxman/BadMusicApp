import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Encryption } from "@/libs/encryption";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data, error: fetchError } = await supabase
      .from("users")
      .select("suno_cookie")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      console.error("Error fetching cookie:", fetchError);
      return new NextResponse("Error fetching cookie", { status: 500 });
    }

    if (!data?.suno_cookie) {
      return new NextResponse("Cookie not found", { status: 404 });
    }

    const decryptedCookie = await Encryption.decrypt(data.suno_cookie);

    if (!decryptedCookie) {
      return NextResponse.json({ error: "Decryption failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
