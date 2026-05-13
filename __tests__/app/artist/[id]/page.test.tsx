import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ArtistPage from "@/app/artist/[id]/page";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { getArtistById, updateArtist, updateArtistAvatar } from "@/lib/api/artist";
import { notFound } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock Navbar and Footer
vi.mock("@/components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the API
vi.mock("@/lib/api/artist", () => ({
  getArtistById: vi.fn(),
  updateArtist: vi.fn(),
  updateArtistAvatar: vi.fn(),
}));

const mockParams = { id: "1" };

describe("ArtistPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useAuth as any).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      refreshAuth: vi.fn(),
    });
  });

  // ... (existing read-only tests) ...
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
      expect(screen.getByText("Песни не найдены")).toBeInTheDocument();
    });
  });

  it("loads more songs when Load More is clicked", async () => {
    // Initial fetch returns exactly 20 songs, indicating there might be more
    const initialSongs = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      title: `Song ${i}`,
      cover_url: "",
      release_date: "2026-05-13",
      views: 100
    }));

    const mockArtistInitial = {
      id: 1,
      name: "The Beatles",
      bio: "English rock band",
      avatar_url: "",
      songs: initialSongs
    };

    const nextSongs = [
      {
        id: 21,
        title: "Song 21",
        cover_url: "",
        release_date: "2026-05-13",
        views: 200
      }
    ];

    const mockArtistNext = {
      id: 1,
      name: "The Beatles",
      bio: "English rock band",
      avatar_url: "",
      songs: nextSongs
    };

    (getArtistById as any)
      .mockResolvedValueOnce(mockArtistInitial)
      .mockResolvedValueOnce(mockArtistNext);

    render(<ArtistPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Song 0")).toBeInTheDocument();
      expect(screen.getByText("Song 19")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Загрузить еще/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Загрузить еще/i }));

    await waitFor(() => {
      expect(screen.getByText("Song 21")).toBeInTheDocument();
      // Button should disappear because next fetch returns < 20 items
      expect(screen.queryByRole("button", { name: /Загрузить еще/i })).not.toBeInTheDocument();
    });
  });

  describe("Inline Editing (Moderator)", () => {
    beforeEach(() => {
      (useAuth as any).mockReturnValue({
        user: { role: 'moderator' },
        token: 'mod-token',
        isAuthenticated: true,
        refreshAuth: vi.fn(),
      });
      (getArtistById as any).mockResolvedValue({
        id: 1,
        name: "The Beatles",
        bio: "English rock band",
        avatar_url: "http://example.com/beatles.jpg",
        songs: []
      });
    });

    it("does not show edit controls to regular users", async () => {
      (useAuth as any).mockReturnValue({
        user: { role: 'user' },
        token: 'user-token',
        isAuthenticated: true,
      });

      render(<ArtistPage params={mockParams} />);
      await waitFor(() => {
        expect(screen.getByText("The Beatles")).toBeInTheDocument();
      });

      // Name should just be text, not have an edit button next to it
      expect(screen.queryByTestId("edit-name-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("avatar-upload-overlay")).not.toBeInTheDocument();
    });

    it("allows moderator to edit name and bio", async () => {
      (updateArtist as any).mockResolvedValue({
        id: 1,
        name: "New Name",
        bio: "New Bio",
        avatar_url: "http://example.com/beatles.jpg",
        songs: []
      });

      render(<ArtistPage params={mockParams} />);
      
      await waitFor(() => {
        expect(screen.getByText("The Beatles")).toBeInTheDocument();
      });

      // Click edit buttons (these need to be implemented with these testids)
      const editNameBtn = screen.getByTestId("edit-name-btn");
      fireEvent.click(editNameBtn);

      const nameInput = screen.getByDisplayValue("The Beatles");
      fireEvent.change(nameInput, { target: { value: "New Name" } });
      
      const saveBtn = screen.getByRole("button", { name: /save/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(updateArtist).toHaveBeenCalledWith("mod-token", 1, { name: "New Name", bio: "English rock band" });
        expect(toast.success).toHaveBeenCalledWith("Profile updated successfully");
        expect(screen.getByText("New Name")).toBeInTheDocument();
      });
    });

    it("allows moderator to upload avatar", async () => {
      (updateArtistAvatar as any).mockResolvedValue({
        avatar_url: "http://example.com/new-avatar.jpg",
      });

      render(<ArtistPage params={mockParams} />);
      
      await waitFor(() => {
        expect(screen.getByText("The Beatles")).toBeInTheDocument();
      });

      const fileInput = screen.getByTestId("avatar-upload-input");
      const file = new File(["dummy"], "avatar.png", { type: "image/png" });
      
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(updateArtistAvatar).toHaveBeenCalledWith("mod-token", 1, file);
        expect(toast.success).toHaveBeenCalledWith("Avatar updated successfully");
      });
    });
  });
});
