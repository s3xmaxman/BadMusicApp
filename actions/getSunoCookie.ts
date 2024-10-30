import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Encryption } from "@/libs/encryption";

export async function getSunoCookie(): Promise<string> {
  try {
    const supabase = createServerComponentClient({ cookies });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data, error: fetchError } = await supabase
      .from("users")
      .select("suno_cookie")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      console.error("Error fetching cookie:", fetchError);
      throw new Error("Error fetching cookie");
    }

    if (!data?.suno_cookie) {
      throw new Error("Cookie not found");
    }

    const decryptedCookie = await Encryption.decrypt(data.suno_cookie);

    if (!decryptedCookie) {
      throw new Error("Decryption resulted in null or empty string");
    }

    return decryptedCookie;
  } catch (error) {
    console.error("Error in getCookie:", error);
    throw error;
  }
}
