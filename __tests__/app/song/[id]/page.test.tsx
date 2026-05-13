import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SongPage from "@/app/song/[id]/page";
import { vi } from "vitest";
import { getSongById, getSongAnnotations, getAiTranslation } from "@/lib/api/song";
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
  getAiTranslation: vi.fn(),
  getAiAnnotation: vi.fn(),
  createAnnotation: vi.fn(),
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

  it("renders Спросить ИИ prompt on selection", async () => {
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
      expect(screen.getByRole("button", { name: /Спросить ИИ/i })).toBeInTheDocument();
    });
  });

  it("opens AIBubble when Спросить ИИ is clicked", async () => {
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
      const askAiButton = screen.getByRole("button", { name: /Спросить ИИ/i });
      fireEvent.click(askAiButton);
    });

    await waitFor(() => {
      expect(screen.getByText("ИИ Объяснение")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Что бы вы хотели узнать об этих словах/i)).toBeInTheDocument();
    });
  });

  describe("AI Translation", () => {
    const mockSong = {
      id: 1,
      title: "Test Song",
      lyrics: "Line one\nLine two",
      artist: { id: 1, name: "Artist" },
    };

    beforeEach(() => {
      (getSongById as any).mockResolvedValue(mockSong);
      (getSongAnnotations as any).mockResolvedValue([]);
      (useAuth as any).mockReturnValue({
        user: { user_id: 1 },
        token: "token",
        isAuthenticated: true,
      });
    });

    it("renders Translate button when authenticated", async () => {
      render(<SongPage params={mockParams} />);
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Translate/i })).toBeInTheDocument();
      });
    });

    it("shows language dropdown when Translate is clicked", async () => {
      render(<SongPage params={mockParams} />);
      await waitFor(() => {
        const translateBtn = screen.getByRole("button", { name: /Translate/i });
        fireEvent.click(translateBtn);
      });
      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("Russian")).toBeInTheDocument();
    });

    it("fetches translation and displays interleaved lyrics", async () => {
      (getAiTranslation as any).mockResolvedValue({
        id: 1,
        response: "Перевод первой строки\nПеревод второй строки",
      });

      render(<SongPage params={mockParams} />);
      
      await waitFor(() => {
        const translateBtn = screen.getByRole("button", { name: /Translate/i });
        fireEvent.click(translateBtn);
      });

      const russianOption = screen.getByText("Russian");
      fireEvent.click(russianOption);

      await waitFor(() => {
        expect(getAiTranslation).toHaveBeenCalledWith(1, "ru", "token");
        expect(screen.getByText("Line one")).toBeInTheDocument();
        expect(screen.getByText("Перевод первой строки")).toBeInTheDocument();
        expect(screen.getByText("Line two")).toBeInTheDocument();
        expect(screen.getByText("Перевод второй строки")).toBeInTheDocument();
        // The main button should now show "Russian"
        expect(screen.getByRole("button", { name: /Russian/i })).toBeInTheDocument();
      });
    });

    it("toggles translation visibility without re-fetching", async () => {
      (getAiTranslation as any).mockResolvedValue({
        id: 1,
        response: "Translation",
      });

      render(<SongPage params={mockParams} />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole("button", { name: /Translate/i }));
      });
      fireEvent.click(screen.getByText("English"));

      await waitFor(() => {
        expect(screen.getByText("Translation")).toBeInTheDocument();
      });

      // Click "Hide"
      const hideBtn = screen.getByRole("button", { name: /Hide/i });
      fireEvent.click(hideBtn);

      await waitFor(() => {
        expect(screen.queryByText("Translation")).not.toBeInTheDocument();
      });

      // Click "Show"
      const showBtn = screen.getByRole("button", { name: /Show/i });
      fireEvent.click(showBtn);

      await waitFor(() => {
        expect(screen.getByText("Translation")).toBeInTheDocument();
        // Confirm no second call to getAiTranslation
        expect(getAiTranslation).toHaveBeenCalledTimes(1);
      });
    });
  });
});
