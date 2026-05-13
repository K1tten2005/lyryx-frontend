import { render, screen, waitFor } from "@testing-library/react";
import ArtistPage from "@/app/artist/[id]/page";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { getArtistById } from "@/lib/api/artist";
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

// Mock the API
vi.mock("@/lib/api/artist", () => ({
  getArtistById: vi.fn(),
}));

const mockParams = { id: "1" };

describe("ArtistPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders artist details successfully with songs", async () => {
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

    (getArtistById as any).mockResolvedValue(mockArtist);

    render(<ArtistPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("The Beatles")).toBeInTheDocument();
      expect(screen.getByText("English rock band formed in Liverpool in 1960.")).toBeInTheDocument();
      expect(screen.getByText("Hey Jude")).toBeInTheDocument();
      expect(screen.getByText("5,000,000")).toBeInTheDocument();
      const avatarImg = screen.getByAltText("The Beatles avatar") as HTMLImageElement;
      expect(decodeURIComponent(avatarImg.src)).toContain("http://example.com/beatles.jpg");
    });
  });

  it("calls notFound() when artist is not found", async () => {
    (getArtistById as any).mockResolvedValue(null);

    render(<ArtistPage params={mockParams} />);

    await waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });

  it("renders error message when API fails", async () => {
    (getArtistById as any).mockRejectedValue(new Error("Network Error"));

    render(<ArtistPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });
  });

  it("displays placeholder when bio is empty", async () => {
    const mockArtist = {
      id: 1,
      name: "The Beatles",
      bio: "",
      avatar_url: "http://example.com/beatles.jpg",
      songs: []
    };

    (getArtistById as any).mockResolvedValue(mockArtist);

    render(<ArtistPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Biography not provided")).toBeInTheDocument();
    });
  });

  it("displays placeholder when songs array is empty", async () => {
    const mockArtist = {
      id: 1,
      name: "The Beatles",
      bio: "English rock band",
      avatar_url: "http://example.com/beatles.jpg",
      songs: []
    };

    (getArtistById as any).mockResolvedValue(mockArtist);

    render(<ArtistPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("No songs found")).toBeInTheDocument();
    });
  });
});
