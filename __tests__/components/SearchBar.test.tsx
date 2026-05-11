import { render, screen } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";

describe("SearchBar", () => {
  it("renders a search input", () => {
    render(<SearchBar />);
    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
  });

  it("has a prominent shadow", () => {
    render(<SearchBar />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("shadow-glass");
  });
});
