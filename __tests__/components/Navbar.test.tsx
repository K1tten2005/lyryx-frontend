import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { vi } from "vitest";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock AuthModal to avoid rendering its complex logic in Navbar tests
vi.mock("@/components/AuthModal", () => {
  return {
    default: function MockAuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
      if (!isOpen) return null;
      return <div data-testid="auth-modal"><button onClick={onClose}>Close Modal</button></div>;
    }
  };
});

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Lyryx logo link", () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: false, user: null });
    render(<Navbar />);
    const logoLink = screen.getByRole("link", { name: /LYRYX/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders a Login button when unauthenticated and opens modal on click", () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: false, user: null });
    render(<Navbar />);
    
    const loginButton = screen.getByRole("button", { name: /log in/i });
    expect(loginButton).toBeInTheDocument();
    
    // Modal should be closed initially
    expect(screen.queryByTestId("auth-modal")).not.toBeInTheDocument();
    
    // Click login to open modal
    fireEvent.click(loginButton);
    expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
    
    // Close modal
    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByTestId("auth-modal")).not.toBeInTheDocument();
  });

  it("renders user profile icon when authenticated", () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true, user: { username: 'testuser' }, logout: vi.fn() });
    render(<Navbar />);
    
    const userButton = screen.getByRole("button");
    // Button shouldn't contain "Log In"
    expect(userButton).not.toHaveTextContent(/log in/i);
    // Since it's an icon button, we expect it to exist
    expect(userButton).toBeInTheDocument();
  });

  it("renders the nav container with indigo-950 background", () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: false, user: null });
    render(<Navbar />);
    const navElement = screen.getByRole("navigation");
    expect(navElement).toHaveClass("bg-indigo-950");
  });
});
