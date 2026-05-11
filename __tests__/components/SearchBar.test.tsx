import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";
import { vi } from "vitest";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

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

  it("navigates to /search when form is submitted", () => {
    const push = vi.fn();
    (useRouter as any).mockReturnValue({ push });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/Search for songs/i);
    
    fireEvent.change(input, { target: { value: "Queen" } });
    fireEvent.submit(input.closest('form') || input); // Fallback if no form yet

    expect(push).toHaveBeenCalledWith("/search?q=Queen");
  });
});
