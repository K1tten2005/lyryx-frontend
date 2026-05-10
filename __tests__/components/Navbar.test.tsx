import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("renders the Lyryx logo link", () => {
    render(<Navbar />);
    const logoLink = screen.getByRole("link", { name: /LYRYX/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders the user profile button", () => {
    render(<Navbar />);
    const userButton = screen.getByRole("button");
    expect(userButton).toBeInTheDocument();
  });
});