import { getArtistById, createArtist, updateArtist, updateArtistAvatar } from "@/lib/api/artist";
import { vi, describe, beforeEach, it, expect } from "vitest";

// Mock the global fetch
global.fetch = vi.fn();

describe("Artist API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getArtistById", () => {
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

  describe("createArtist", () => {
    it("should create artist successfully", async () => {
      const mockResponse = {
        id: 2,
        name: "New Artist",
        bio: "A test bio",
        avatar_url: "",
        songs: []
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      });

      const result = await createArtist("mock-token", { name: "New Artist", bio: "A test bio" });
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/v1/artist",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer mock-token",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ name: "New Artist", bio: "A test bio" }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if creation fails", async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: "Failed to create artist" }),
      });

      await expect(createArtist("token", { name: "" })).rejects.toThrow("Failed to create artist");
    });
  });

  describe("updateArtist", () => {
    it("should update artist successfully", async () => {
      const mockResponse = {
        id: 1,
        name: "Updated Name",
        bio: "Updated bio",
        avatar_url: "",
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await updateArtist("mock-token", 1, { name: "Updated Name", bio: "Updated bio" });
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/v1/artist/1",
        expect.objectContaining({
          method: "PATCH",
          headers: expect.objectContaining({
            Authorization: "Bearer mock-token",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ artistID: 1, name: "Updated Name", bio: "Updated bio" }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if update fails", async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ message: "Failed to update artist" }),
      });

      await expect(updateArtist("token", 1, { name: "Test" })).rejects.toThrow("Failed to update artist");
    });
  });

  describe("updateArtistAvatar", () => {
    it("should update artist avatar successfully", async () => {
      const mockResponse = {
        avatar_url: "http://example.com/new-avatar.jpg",
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const file = new File(["dummy content"], "avatar.png", { type: "image/png" });
      const result = await updateArtistAvatar("mock-token", 1, file);
      
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/v1/artist/1/avatar",
        expect.objectContaining({
          method: "PATCH",
          headers: expect.objectContaining({
            Authorization: "Bearer mock-token",
          }),
          body: expect.any(FormData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if avatar update fails", async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: "Failed to update artist avatar" }),
      });

      const file = new File([""], "avatar.png");
      await expect(updateArtistAvatar("token", 1, file)).rejects.toThrow("Failed to update artist avatar");
    });
  });
});
