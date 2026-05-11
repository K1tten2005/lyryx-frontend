import { render, screen } from "@testing-library/react";
import SearchPage from "@/app/search/page";
import { vi } from "vitest";
import { useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isInitialized: true,
    user: null,
  }),
}));

describe("SearchPage", () => {
  it("renders search results heading with query", () => {
    (useSearchParams as any).mockReturnValue(new URLSearchParams("q=Bohemian Rhapsody"));
    render(<SearchPage />);
    expect(screen.getByRole("heading", { name: /Search Results/i })).toBeInTheDocument();
    expect(screen.getByText(/Results for/i)).toBeInTheDocument();
    expect(screen.getByText("Bohemian Rhapsody")).toBeInTheDocument();
  });

  it("renders a message when no query is provided", () => {
    (useSearchParams as any).mockReturnValue(new URLSearchParams(""));
    render(<SearchPage />);
    expect(screen.getByText(/Please enter a search query/i)).toBeInTheDocument();
  });
});
