import { render, screen, waitFor } from "@testing-library/react";
import SongPage from "@/app/song/[id]/page";
import { vi } from "vitest";
import { getSongById } from "@/lib/api/song";
import { notFound } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

// Mock the API
vi.mock("@/lib/api/song", () => ({
  getSongById: vi.fn(),
}));

const mockParams = { id: "1" };

describe("SongPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders song details successfully", async () => {
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

    (getSongById as any).mockResolvedValue(mockSong);

    render(<SongPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Bohemian Rhapsody")).toBeInTheDocument();
      expect(screen.getByText("Queen")).toBeInTheDocument();
      expect(screen.getByText(/1975-10-31/i)).toBeInTheDocument();
      expect(screen.getByText(/1,000,000/i)).toBeInTheDocument();
      expect(screen.getByText(/Is this the real life\? Is this just fantasy\?/i)).toBeInTheDocument();
      const coverImg = screen.getByAltText("Bohemian Rhapsody cover") as HTMLImageElement;
      expect(coverImg.src).toContain("http://example.com/cover.jpg");
    });
  });

  it("calls notFound() when song is not found", async () => {
    (getSongById as any).mockResolvedValue(null);

    render(<SongPage params={mockParams} />);

    await waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });

  it("renders error message when API fails", async () => {
    (getSongById as any).mockRejectedValue(new Error("Network Error"));

    render(<SongPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });
  });
});
