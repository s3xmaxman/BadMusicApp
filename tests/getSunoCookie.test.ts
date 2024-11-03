import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Encryption } from "@/libs/encryption";
import { SupabaseClient } from "@supabase/supabase-js";
import { getSunoCookie } from "@/actions/getSunoCookie";

// Mocking the required modules
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createServerComponentClient: jest.fn(),
}));

jest.mock("@/libs/encryption", () => ({
  Encryption: {
    decrypt: jest.fn(),
  },
}));

jest.mock("next/headers", () => ({
  cookies: {},
}));

// Mock console.error to suppress error logs during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("getSunoCookie", () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  } as unknown as SupabaseClient;

  const mockUser = {
    id: "test-user-id",
  };

  const mockEncryptedCookie = "encrypted-cookie-value";
  const mockDecryptedCookie = "decrypted-cookie-value";

  beforeEach(() => {
    jest.clearAllMocks();
    (createServerComponentClient as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn(),
        }),
      }),
    });
    (Encryption.decrypt as jest.Mock).mockResolvedValue(mockDecryptedCookie);
  });

  it("should successfully return decrypted cookie", async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    (mockSupabase.from as jest.Mock)()
      .select()
      .eq()
      .single.mockResolvedValue({
        data: { suno_cookie: mockEncryptedCookie },
        error: null,
      });

    const result = await getSunoCookie();

    expect(result).toBe(mockDecryptedCookie);
    expect(createServerComponentClient).toHaveBeenCalledWith({ cookies: {} });
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(Encryption.decrypt).toHaveBeenCalledWith(mockEncryptedCookie);
  });

  it("should throw error when user is not authenticated", async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: new Error("Unauthorized"),
    });

    await expect(getSunoCookie()).rejects.toThrow("Unauthorized");
  });

  it("should throw error when fetching cookie fails", async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    (mockSupabase.from as jest.Mock)()
      .select()
      .eq()
      .single.mockResolvedValue({
        data: null,
        error: new Error("Database error"),
      });

    await expect(getSunoCookie()).rejects.toThrow("Error fetching cookie");
  });

  it("should throw error when cookie is not found", async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    (mockSupabase.from as jest.Mock)()
      .select()
      .eq()
      .single.mockResolvedValue({
        data: { suno_cookie: null },
        error: null,
      });

    await expect(getSunoCookie()).rejects.toThrow("Cookie not found");
  });

  it("should throw error when decryption fails", async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    (mockSupabase.from as jest.Mock)()
      .select()
      .eq()
      .single.mockResolvedValue({
        data: { suno_cookie: mockEncryptedCookie },
        error: null,
      });

    (Encryption.decrypt as jest.Mock).mockResolvedValue(null);

    await expect(getSunoCookie()).rejects.toThrow(
      "Decryption resulted in null or empty string"
    );
  });
});
