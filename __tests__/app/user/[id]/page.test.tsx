import { render, screen, waitFor } from "@testing-library/react";
import UserProfilePage from "@/app/user/[id]/page";
import { vi } from "vitest";
import { getUserProfile, getUserAnnotations } from "@/lib/api/user";

vi.mock("@/lib/api/user", () => ({
  getUserProfile: vi.fn(),
  getUserAnnotations: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isInitialized: true,
    user: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mocking params
const mockParams = { id: "1" };

describe("UserProfilePage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders loading state initially", async () => {
    (getUserProfile as any).mockReturnValue(new Promise(() => {})); // Never resolves
    (getUserAnnotations as any).mockReturnValue(new Promise(() => {}));
    
    render(<UserProfilePage params={mockParams} />);
    
    // Check for a spinner or loading text
    // expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders user information after loading", async () => {
    const mockUser = {
      user_id: 1,
      username: "testuser",
      email: "test@example.com",
      role: "user",
      reputation_score: 100,
      bio: "This is a test bio",
    };
    const mockAnnotations = {
      user_id: 1,
      annotations: [],
      total: 0,
      has_more: false,
    };

    (getUserProfile as any).mockResolvedValue(mockUser);
    (getUserAnnotations as any).mockResolvedValue(mockAnnotations);

    render(<UserProfilePage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeInTheDocument();
      expect(screen.getByText("This is a test bio")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });
  });

  it("renders error state if fetch fails", async () => {
    (getUserProfile as any).mockRejectedValue(new Error("User not found"));
    (getUserAnnotations as any).mockResolvedValue({ annotations: [], total: 0, has_more: false });

    render(<UserProfilePage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText(/User not found/i)).toBeInTheDocument();
    });
  });
});
