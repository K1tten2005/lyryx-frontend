import { getArtistById } from "@/lib/api/artist";
import { vi, describe, beforeEach, it, expect } from "vitest";

// Mock the global fetch
global.fetch = vi.fn();

describe("getArtistById", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch artist by ID successfully with default pagination", async () => {
    const mockArtist = {
      id: 1,
      name: "The Beatles",
      bio: "English rock band formed in Liverpool in 1960.",
      avatar_url: "http://example.com/beatles.jpg",
      songs: [
        {
          id: 101,
          title: "Hey Jude",
          cover_url: "http://example.com/hey-jude.jpg",
          release_date: "1968-08-26",
          views: 5000000
        }
      ]
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockArtist,
    });

    const artist = await getArtistById(1);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/v1/artist/1?limit=20&offset=0", expect.any(Object));
    expect(artist).toEqual(mockArtist);
  });

  it("should fetch artist by ID successfully with custom pagination", async () => {
    const mockArtist = {
      id: 1,
      name: "The Beatles",
      bio: "",
      avatar_url: "",
      songs: []
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockArtist,
    });

    const artist = await getArtistById(1, 10, 20);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/v1/artist/1?limit=10&offset=20", expect.any(Object));
    expect(artist).toEqual(mockArtist);
  });

  it("should return null when artist is not found (404)", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const artist = await getArtistById(999);
    expect(artist).toBeNull();
  });

  it("should throw an error on other failed requests", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getArtistById(1)).rejects.toThrow("Failed to fetch artist");
  });
});
