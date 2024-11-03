// tests/getPlaylistSongs.test.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getPlaylistSongs from "@/actions/getPlaylistSongs";

jest.mock("@supabase/auth-helpers-nextjs");
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("getPlaylistSongs", () => {
  let mockSupabaseClient: any;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockSupabaseClient = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: {
            session: {
              user: { id: "test-user-id" },
            },
          },
        }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn(),
    };

    (createServerComponentClient as jest.Mock).mockReturnValue(
      mockSupabaseClient
    );
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("should return an empty array when user is not authenticated", async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
    });

    const result = await getPlaylistSongs("test-playlist-id");

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
  });

  it("should fetch and combine regular and suno songs", async () => {
    const mockRegularSongs = [
      { songs: { id: "1", title: "Regular Song 1", created_at: "2023-01-01" } },
      { songs: { id: "2", title: "Regular Song 2", created_at: "2023-01-02" } },
    ];
    const mockSunoSongs = [
      {
        suno_songs: { id: "3", title: "Suno Song 1", created_at: "2023-01-03" },
      },
      {
        suno_songs: { id: "4", title: "Suno Song 2", created_at: "2023-01-04" },
      },
    ];

    mockSupabaseClient.order.mockResolvedValueOnce({
      data: mockRegularSongs,
      error: null,
    });
    mockSupabaseClient.order.mockResolvedValueOnce({
      data: mockSunoSongs,
      error: null,
    });

    const result = await getPlaylistSongs("test-playlist-id");

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({
      ...mockSunoSongs[1].suno_songs,
      songType: "suno",
    });
    expect(result[1]).toEqual({
      ...mockSunoSongs[0].suno_songs,
      songType: "suno",
    });
    expect(result[2]).toEqual({
      ...mockRegularSongs[1].songs,
      songType: "regular",
    });
    expect(result[3]).toEqual({
      ...mockRegularSongs[0].songs,
      songType: "regular",
    });
  });

  it("should handle errors when fetching songs", async () => {
    mockSupabaseClient.order.mockResolvedValueOnce({
      data: null,
      error: new Error("Database error"),
    });
    mockSupabaseClient.order.mockResolvedValueOnce({
      data: null,
      error: new Error("Database error"),
    });

    await getPlaylistSongs("test-playlist-id");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching regular playlist songs:",
      expect.any(Error)
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching suno playlist songs:",
      expect.any(Error)
    );
  });
});
