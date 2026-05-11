import { render, screen } from "@testing-library/react";
import UserProfileHeader from "@/components/UserProfileHeader";
import { UserProfile } from "@/lib/api/user";
import { vi } from "vitest";

const mockUseAuth = vi.fn();
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("UserProfileHeader", () => {
  const mockUser: UserProfile = {
    user_id: 1,
    username: "testuser",
    email: "test@example.com",
    role: "Editor",
    reputation_score: 1250,
    bio: "Music lover and annotation expert.",
    avatar_url: "https://example.com/avatar.jpg",
  };

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
    });
  });

  it("renders user information correctly", () => {
    render(<UserProfileHeader user={mockUser} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("Editor")).toBeInTheDocument();
    expect(screen.getByText(/1[,\s]?250/)).toBeInTheDocument();
    expect(screen.getByText(/Music lover and annotation expert./)).toBeInTheDocument();
    
    const avatar = screen.getByAltText("testuser");
    expect(avatar).toHaveAttribute("src");
    // Next.js Image might change the src, but we check it's present
  });

  it("renders fallback for missing avatar", () => {
    const userWithoutAvatar = { ...mockUser, avatar_url: undefined };
    render(<UserProfileHeader user={userWithoutAvatar} />);

    expect(screen.getByText("T")).toBeInTheDocument(); // First letter of testuser
  });

  it("renders fallback for missing bio", () => {
    const userWithoutBio = { ...mockUser, bio: undefined };
    render(<UserProfileHeader user={userWithoutBio} />);

    expect(screen.queryByText("Music lover and annotation expert.")).not.toBeInTheDocument();
  });

  it("renders 'Edit Profile' button for the profile owner", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: "test-token",
    });
    
    render(<UserProfileHeader user={mockUser} />);
    expect(screen.getByRole("button", { name: /edit profile/i })).toBeInTheDocument();
  });

  it("does not render 'Edit Profile' button for other users", () => {
    mockUseAuth.mockReturnValue({
      user: { user_id: 2, username: "otheruser" },
      token: "test-token",
    });
    
    render(<UserProfileHeader user={mockUser} />);
    expect(screen.queryByRole("button", { name: /edit profile/i })).not.toBeInTheDocument();
  });

  it("does not render 'Edit Profile' button when not logged in", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
    });
    
    render(<UserProfileHeader user={mockUser} />);
    expect(screen.queryByRole("button", { name: /edit profile/i })).not.toBeInTheDocument();
  });
});
