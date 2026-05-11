import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { vi } from "vitest";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn().mockReturnValue({ isAuthenticated: false, user: null }),
}));

describe("HomePage", () => {
  it("renders the main heading", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { name: /Understand the Music./i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the Navbar, SearchBar, and Footer", () => {
    render(<HomePage />);
    // Navbar
    expect(screen.getByRole("link", { name: /LYRYX/i })).toBeInTheDocument();
    
    // SearchBar
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    
    // Footer
    expect(screen.getByText(/Lyryx. All rights reserved./i)).toBeInTheDocument();
  });
});