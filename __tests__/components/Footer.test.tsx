import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders the copyright year", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    const copyrightText = screen.getByText(new RegExp(year.toString(), "i"));
    expect(copyrightText).toBeInTheDocument();
    expect(screen.getByText(/Lyryx. All rights reserved./i)).toBeInTheDocument();
  });

  it("has the correct background and text colors", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("bg-indigo-950");
    expect(footer).toHaveClass("text-zinc-300");
  });
});
