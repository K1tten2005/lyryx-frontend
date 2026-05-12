import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SongPage from "@/app/song/[id]/page";
import { vi } from "vitest";
import { getSongById, getSongAnnotations } from "@/lib/api/song";
import { notFound } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

// Mock Navbar and Footer
vi.mock("@/components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: null,
    token: null,
    isAuthenticated: false,
    refreshAuth: vi.fn(),
  })),
}));

import { useAuth } from "@/contexts/AuthContext";
import { useTextSelection } from "@/hooks/useTextSelection";

vi.mock("@/hooks/useTextSelection", () => ({
  useTextSelection: vi.fn(() => ({
    selection: null,
    setSelection: vi.fn(),
    handleSelection: vi.fn(),
  })),
}));

// Mock the API
vi.mock("@/lib/api/song", () => ({
  getSongById: vi.fn(),
  getSongAnnotations: vi.fn(),
}));

const mockParams = { id: "1" };

describe("SongPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useAuth as any).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      refreshAuth: vi.fn(),
    });
    (useTextSelection as any).mockReturnValue({
      selection: null,
      setSelection: vi.fn(),
      handleSelection: vi.fn(),
    });
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
    (getSongAnnotations as any).mockResolvedValue([]);

    render(<SongPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Bohemian Rhapsody")).toBeInTheDocument();
      expect(screen.getByText("Queen")).toBeInTheDocument();
      expect(screen.getByTestId("release-date")).toHaveTextContent("31.10.1975");
      expect(screen.getByText(/1,000,000/i)).toBeInTheDocument();
      expect(screen.getByText(/Is this the real life\? Is this just fantasy\?/i)).toBeInTheDocument();
      const coverImg = screen.getByAltText("Bohemian Rhapsody cover") as HTMLImageElement;
      expect(decodeURIComponent(coverImg.src)).toContain("http://example.com/cover.jpg");
    });
  });

  it("calls notFound() when song is not found", async () => {
    (getSongById as any).mockResolvedValue(null);
    (getSongAnnotations as any).mockResolvedValue([]);

    render(<SongPage params={mockParams} />);

    await waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });

  it("renders error message when API fails", async () => {
    (getSongById as any).mockRejectedValue(new Error("Network Error"));
    (getSongAnnotations as any).mockResolvedValue([]);

    render(<SongPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });
  });

  it("renders lyrics with annotations and opens bubble on click", async () => {
    const mockSong = {
      id: 1,
      title: "Test Song",
      lyrics: "Line one\nLine two is here",
      artist: { id: 1, name: "Artist" },
    };
    const mockAnnotations = [
      {
        id: 101,
        content: "Meaning of line one",
        start_index: 0,
        end_index: 8, // "Line one"
        rating: 0,
        created_at: "2026-05-12",
        user: { user_id: 1, username: "tester", reputation_score: 10 },
      },
    ];

    (getSongById as any).mockResolvedValue(mockSong);
    (getSongAnnotations as any).mockResolvedValue(mockAnnotations);

    render(<SongPage params={mockParams} />);

    await waitFor(() => {
      // The highlighted text should be present
      expect(screen.getByText("Line one")).toBeInTheDocument();
      // Initially, bubble content is hidden
      expect(screen.queryByText("Meaning of line one")).not.toBeInTheDocument();
    });

    // Click the highlight
    fireEvent.click(screen.getByText("Line one"));

    // Now the bubble should be visible
    await waitFor(() => {
      expect(screen.getByText("Meaning of line one")).toBeInTheDocument();
      expect(screen.getByText("tester")).toBeInTheDocument();
    });
  });

  it("renders Ask AI prompt on selection", async () => {
    const mockSong = {
      id: 1,
      title: "Test Song",
      lyrics: "Line one\nLine two is here",
      artist: { id: 1, name: "Artist" },
    };

    (getSongById as any).mockResolvedValue(mockSong);
    (getSongAnnotations as any).mockResolvedValue([]);
    (useAuth as any).mockReturnValue({
      user: { user_id: 1 },
      token: "token",
      isAuthenticated: true,
    });
    (useTextSelection as any).mockReturnValue({
      selection: {
        text: "Line one",
        startIndex: 0,
        endIndex: 8,
        lastRelativeRect: { top: 10, bottom: 20, left: 0, right: 100 }
      },
      setSelection: vi.fn(),
      handleSelection: vi.fn(),
    });

    render(<SongPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Add Annotation/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Ask AI/i })).toBeInTheDocument();
    });
  });

  it("opens AIBubble when Ask AI is clicked", async () => {
    const mockSong = {
      id: 1,
      title: "Test Song",
      lyrics: "Line one\nLine two is here",
      artist: { id: 1, name: "Artist" },
    };

    (getSongById as any).mockResolvedValue(mockSong);
    (getSongAnnotations as any).mockResolvedValue([]);
    (useAuth as any).mockReturnValue({
      user: { user_id: 1 },
      token: "token",
      isAuthenticated: true,
    });
    (useTextSelection as any).mockReturnValue({
      selection: {
        text: "Line one",
        startIndex: 0,
        endIndex: 8,
        lastRelativeRect: { top: 10, bottom: 20, left: 0, right: 100 }
      },
      setSelection: vi.fn(),
      handleSelection: vi.fn(),
    });

    render(<SongPage params={mockParams} />);

    await waitFor(() => {
      const askAiButton = screen.getByRole("button", { name: /Ask AI/i });
      fireEvent.click(askAiButton);
    });

    await waitFor(() => {
      expect(screen.getByText("AI Explanation")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/What would you like to know about these lyrics/i)).toBeInTheDocument();
    });
  });
});
