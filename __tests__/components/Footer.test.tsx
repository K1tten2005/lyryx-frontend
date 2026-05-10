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
});