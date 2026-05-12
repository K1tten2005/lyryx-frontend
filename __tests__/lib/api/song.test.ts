import { getSongById } from "@/lib/api/song";
import { vi } from "vitest";

// Mock the global fetch
global.fetch = vi.fn();

describe("getSongById", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch song by ID successfully", async () => {
    const mockSong = {
      id: 1,
      title: "Bohemian Rhapsody",
      lyrics: "Is this the real life? Is this just fantasy?",
      release_date: "1975-10-31",
      views: 1000000,
      artist: {
        id: 1,
        name: "Queen",
      },
      cover_url: "http://example.com/cover.jpg",
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockSong,
    });

    const song = await getSongById(1);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/v1/song/1", expect.any(Object));
    expect(song).toEqual(mockSong);
  });

  it("should return null when song is not found (404)", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const song = await getSongById(999);
    expect(song).toBeNull();
  });

  it("should throw an error on other failed requests", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getSongById(1)).rejects.toThrow("Failed to fetch song");
  });
});
