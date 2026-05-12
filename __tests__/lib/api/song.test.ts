import { getSongById, getSongAnnotations, createAnnotation } from "@/lib/api/song";
import { vi, describe, beforeEach, it, expect } from "vitest";

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

describe("getSongAnnotations", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch annotations successfully", async () => {
    const mockAnnotations = {
      song_id: 1,
      annotations: [
        {
          id: 101,
          content: "Test annotation",
          start_index: 0,
          end_index: 10,
          rating: 5,
          created_at: "2026-05-12T12:00:00Z",
          user: {
            user_id: 1,
            username: "tester",
            reputation_score: 100,
            avatar_url: "http://example.com/avatar.jpg"
          },
        },
      ],
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockAnnotations,
    });

    const result = await getSongAnnotations(1);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/v1/song/1/annotations", expect.any(Object));
    expect(result).toEqual(mockAnnotations.annotations);
  });

  it("should throw an error if fetch fails", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getSongAnnotations(1)).rejects.toThrow("Failed to fetch annotations");
  });
});

describe("createAnnotation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create annotation successfully", async () => {
    const mockResponse = {
      id: 102,
      content: "New annotation",
      start_index: 15,
      end_index: 25,
      song_id: 1,
      rating: 0,
      created_at: "2026-05-12T12:05:00Z",
      user: {
        user_id: 1,
        username: "tester",
        reputation_score: 100,
        avatar_url: "http://example.com/avatar.jpg"
      },
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => mockResponse,
    });

    const result = await createAnnotation(1, "New annotation", 15, 25, "mock-token");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/song/1/annotation",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
        body: JSON.stringify({
          songID: 1,
          content: "New annotation",
          start_index: 15,
          end_index: 25,
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if creation fails", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 400,
    });

    await expect(createAnnotation(1, "Fail", 0, 5, "token")).rejects.toThrow("Failed to create annotation");
  });
});
