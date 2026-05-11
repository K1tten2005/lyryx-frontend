import { render, screen, waitFor } from "@testing-library/react";
import SearchPage from "@/app/search/page";
import { vi } from "vitest";
import { useSearchParams } from "next/navigation";
import * as SWR from "swr"; // Import all as SWR so we can mock the default export
import { fetchSearchResults } from "@/lib/api/search";

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

vi.mock("@/lib/api/search", () => ({
  fetchSearchResults: vi.fn(),
}));

// Provide a default mock for SWR
vi.mock("swr", () => ({
  default: vi.fn(),
}));

describe("SearchPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders search results heading with query", async () => {
    (useSearchParams as any).mockReturnValue(new URLSearchParams("q=Bohemian Rhapsody"));
    (SWR.default as any).mockReturnValue({
      data: { artists: [], songs: [], lyrics_matched_songs: [], users: [] },
      error: null,
      isLoading: false,
    });

    render(<SearchPage />);
    
    await waitFor(() => {
        expect(screen.getByRole("heading", { name: /Search Results/i })).toBeInTheDocument();
        expect(screen.getByText("No results found")).toBeInTheDocument(); // Updated assertion for new empty state UI
    });
  });

  it("renders a message when no query is provided", () => {
    (useSearchParams as any).mockReturnValue(new URLSearchParams(""));
    (SWR.default as any).mockReturnValue({ data: null, error: null, isLoading: false });
    
    render(<SearchPage />);
    expect(screen.getByText(/Please enter a search query/i)).toBeInTheDocument();
  });

  it("renders loading state initially when query is provided", () => {
    (useSearchParams as any).mockReturnValue(new URLSearchParams("q=Queen"));
    (SWR.default as any).mockReturnValue({ data: null, error: null, isLoading: true });

    render(<SearchPage />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders empty state if no results found", async () => {
    (useSearchParams as any).mockReturnValue(new URLSearchParams("q=NonexistentQuery"));
    (SWR.default as any).mockReturnValue({
      data: { artists: [], songs: [], lyrics_matched_songs: [], users: [] },
      error: null,
      isLoading: false,
    });
    
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText("No results found")).toBeInTheDocument(); // Updated assertion
      expect(screen.getByText("NonexistentQuery")).toBeInTheDocument();
    });
  });
});

