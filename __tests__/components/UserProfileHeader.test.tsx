import { render, screen } from "@testing-library/react";
import UserProfileHeader from "@/components/UserProfileHeader";
import { UserProfile } from "@/lib/api/user";

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
});
