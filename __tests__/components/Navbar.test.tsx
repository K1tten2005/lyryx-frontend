import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("renders the Lyryx logo link with light text for dark background", () => {
    render(<Navbar />);
    const logoLink = screen.getByRole("link", { name: /LYRYX/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
    expect(logoLink).toHaveClass("text-white");
  });

  it("renders the user profile button with appropriate dark theme hover states", () => {
    render(<Navbar />);
    const userButton = screen.getByRole("button");
    expect(userButton).toBeInTheDocument();
    expect(userButton).toHaveClass("text-zinc-300");
  });

  it("renders the nav container with indigo-950 background", () => {
    render(<Navbar />);
    const navElement = screen.getByRole("navigation");
    expect(navElement).toHaveClass("bg-indigo-950");
  });
});