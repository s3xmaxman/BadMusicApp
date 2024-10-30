import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Encryption } from "@/libs/encryption";
import { getSunoCookie } from "@/actions/getSunoCookie";
import { get } from "http";

// モックの設定
jest.mock("@supabase/auth-helpers-nextjs");
jest.mock("@/libs/encryption");
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("getCookie", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常にcookieを取得できる場合", async () => {
    // モックの戻り値を設定
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "user123" } },
          error: null,
        }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { suno_cookie: "encryptedCookie" },
        error: null,
      }),
    };
    (createServerComponentClient as jest.Mock).mockReturnValue(mockSupabase);
    (Encryption.decrypt as jest.Mock).mockResolvedValue("decryptedCookie");

    const result = await getSunoCookie();

    expect(result).toBe("decryptedCookie");
  });

  it("ユーザーが認証されていない場合", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("Unauthorized"),
        }),
      },
    };
    (createServerComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    await expect(getSunoCookie()).rejects.toThrow("Unauthorized");
  });

  it("cookieが見つからない場合", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "user123" } },
          error: null,
        }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    };
    (createServerComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    await expect(getSunoCookie()).rejects.toThrow("Cookie not found");
  });

  it("復号化に失敗した場合", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "user123" } },
          error: null,
        }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { suno_cookie: "encryptedCookie" },
        error: null,
      }),
    };
    (createServerComponentClient as jest.Mock).mockReturnValue(mockSupabase);
    (Encryption.decrypt as jest.Mock).mockResolvedValue(null);

    await expect(getSunoCookie()).rejects.toThrow(
      "Decryption resulted in null or empty string"
    );
  });
});
