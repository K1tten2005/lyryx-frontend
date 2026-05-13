import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CreateSongPage from "@/app/artist/[id]/create-song/page";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useAuth } from "@/contexts/AuthContext";
import { createSong } from "@/lib/api/song";
import { getArtistById } from "@/lib/api/artist";
import toast from "react-hot-toast";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: vi.fn() }),
}));

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

vi.mock("@/lib/api/song", () => ({
  createSong: vi.fn(),
}));

vi.mock("@/lib/api/artist", () => ({
  getArtistById: vi.fn(),
}));

const mockParams = { id: "1" };

describe("CreateSongPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockPush.mockClear();
    (useAuth as any).mockReturnValue({
      user: { role: 'moderator' },
      token: 'mod-token',
      isAuthenticated: true,
      refreshAuth: vi.fn(),
    });
    (getArtistById as any).mockResolvedValue({
      id: 1,
      name: "Test Artist",
      bio: "Bio",
      avatar_url: null,
      songs: []
    });
  });

  it("renders the creation form for moderators", async () => {
    render(<CreateSongPage params={mockParams} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Добавить песню/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Artist/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Название песни/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Дата выхода/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Текст песни/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Создать песню/i })).toBeInTheDocument();
    });
  });

  it("submits the form successfully and redirects", async () => {
    (createSong as any).mockResolvedValue({
      id: 100,
      title: "New Song",
    });

    render(<CreateSongPage params={mockParams} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Название песни/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Название песни/i), { target: { value: "New Song" } });
    fireEvent.change(screen.getByLabelText(/Дата выхода/i), { target: { value: "2026-05-13" } });
    fireEvent.change(screen.getByLabelText(/Текст песни/i), { target: { value: "La la la lyrics" } });

    fireEvent.click(screen.getByRole("button", { name: /Создать песню/i }));

    await waitFor(() => {
      expect(createSong).toHaveBeenCalledWith("mod-token", {
        artist_id: 1,
        title: "New Song",
        release_date: "2026-05-13",
        lyrics: "La la la lyrics"
      });
      expect(toast.success).toHaveBeenCalledWith("Song created successfully");
      expect(mockPush).toHaveBeenCalledWith("/song/100");
    });
  });

  it("shows error if regular user tries to access", async () => {
    (useAuth as any).mockReturnValue({
      user: { role: 'user' },
      token: 'user-token',
      isAuthenticated: true,
      refreshAuth: vi.fn(),
    });

    render(<CreateSongPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    });
  });

  it("shows validation errors on empty submission", async () => {
    render(<CreateSongPage params={mockParams} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Название песни/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Создать песню/i }));

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Release date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Lyrics are required/i)).toBeInTheDocument();
    });
  });
});