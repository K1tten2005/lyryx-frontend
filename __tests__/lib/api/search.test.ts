import { fetchSearchResults } from "@/lib/api/search";
import { vi } from "vitest";

// Mock the global fetch
global.fetch = vi.fn();

describe("fetchSearchResults", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch search results successfully", async () => {
    const mockResponse = {
      artists: [],
      songs: [],
      lyrics: [],
      users: [],
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const results = await fetchSearchResults("Queen");
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/v1/search?q=Queen&limit=20", expect.any(Object));
    expect(results).toEqual(mockResponse);
  });

  it("should throw an error on failed request", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchSearchResults("Queen")).rejects.toThrow("Failed to fetch search results");
  });
});
