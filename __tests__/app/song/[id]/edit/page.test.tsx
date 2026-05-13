import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EditSongPage from "@/app/song/[id]/edit/page";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useAuth } from "@/contexts/AuthContext";
import { getSongById, updateSong, updateSongCover } from "@/lib/api/song";
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
  getSongById: vi.fn(),
  updateSong: vi.fn(),
  updateSongCover: vi.fn(),
}));

const mockParams = { id: "100" };

describe("EditSongPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockPush.mockClear();
    (useAuth as any).mockReturnValue({
      user: { role: 'moderator' },
      token: 'mod-token',
      isAuthenticated: true,
      refreshAuth: vi.fn(),
    });
    (getSongById as any).mockResolvedValue({
      id: 100,
      title: "Old Title",
      lyrics: "Old lyrics",
      release_date: "2020-01-01",
      cover_url: null,
      artist: { id: 1, name: "Artist Name" }
    });
  });

  it("renders the edit form pre-populated with song data", async () => {
    render(<EditSongPage params={mockParams} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Edit Song/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue("Old Title")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2020-01-01")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Old lyrics")).toBeInTheDocument();
    });
  });

  it("submits the updated song text fields successfully", async () => {
    (updateSong as any).mockResolvedValue({
      id: 100,
      title: "New Title",
    });

    render(<EditSongPage params={mockParams} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue("Old Title")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Song Title/i), { target: { value: "New Title" } });
    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(updateSong).toHaveBeenCalledWith("mod-token", 100, {
        title: "New Title",
        release_date: "2020-01-01",
        lyrics: "Old lyrics"
      });
      expect(toast.success).toHaveBeenCalledWith("Song updated successfully");
      expect(mockPush).toHaveBeenCalledWith("/song/100");
    });
  });

  it("handles automatic token refresh on 401 when saving text details", async () => {
    const mockRefresh = vi.fn().mockResolvedValue("new-token");
    (useAuth as any).mockReturnValue({
      user: { role: 'moderator' },
      token: 'expired-token',
      isAuthenticated: true,
      refreshAuth: mockRefresh,
    });

    // First call fails with 401, second call succeeds
    const error401 = new Error("Unauthorized");
    (error401 as any).status = 401;
    (updateSong as any)
      .mockRejectedValueOnce(error401)
      .mockResolvedValueOnce({ id: 100, title: "New Title" });

    render(<EditSongPage params={mockParams} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue("Old Title")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
      expect(updateSong).toHaveBeenCalledWith("new-token", 100, expect.any(Object));
      expect(toast.success).toHaveBeenCalledWith("Song updated successfully");
    });
  });

  it("uploads a new cover image successfully", async () => {
    (updateSongCover as any).mockResolvedValue({
      cover_url: "http://example.com/new-cover.jpg",
    });

    render(<EditSongPage params={mockParams} />);
    
    await waitFor(() => {
      expect(screen.getByTestId("cover-upload-input")).toBeInTheDocument();
    });

    const fileInput = screen.getByTestId("cover-upload-input");
    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(updateSongCover).toHaveBeenCalledWith("mod-token", 100, file);
      expect(toast.success).toHaveBeenCalledWith("Cover image updated successfully");
    });
  });

  it("shows access denied for regular users", async () => {
    (useAuth as any).mockReturnValue({
      user: { role: 'user' },
      token: 'user-token',
      isAuthenticated: true,
      refreshAuth: vi.fn(),
    });

    render(<EditSongPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    });
  });
});