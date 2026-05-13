import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateArtistModal from "@/components/CreateArtistModal";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { createArtist } from "@/lib/api/artist";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

vi.mock("@/lib/api/artist", () => ({
  createArtist: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("CreateArtistModal", () => {
  const mockOnClose = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (useAuth as any).mockReturnValue({
      token: "fake-token",
    });
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders correctly", () => {
    render(<CreateArtistModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByRole("heading", { name: "Новый Артист" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Биография/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Создать/i })).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<CreateArtistModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole("heading", { name: "Новый Артист" })).not.toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(<CreateArtistModal isOpen={true} onClose={mockOnClose} />);
    
    const submitBtn = screen.getByRole("button", { name: /Создать/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
    expect(createArtist).not.toHaveBeenCalled();
  });

  it("submits successfully and redirects", async () => {
    (createArtist as any).mockResolvedValue({ id: 123, name: "Новый Артист" });

    render(<CreateArtistModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByLabelText(/Имя/i), { target: { value: "Новый Артист" } });
    fireEvent.change(screen.getByLabelText(/Биография/i), { target: { value: "A cool bio" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Создать/i }));

    await waitFor(() => {
      expect(createArtist).toHaveBeenCalledWith("fake-token", { name: "Новый Артист", bio: "A cool bio" });
      expect(toast.success).toHaveBeenCalledWith("Artist created successfully!");
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/artist/123");
    });
  });

  it("displays error on failure", async () => {
    (createArtist as any).mockRejectedValue(new Error("API Error"));

    render(<CreateArtistModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByLabelText(/Имя/i), { target: { value: "Новый Артист" } });
    fireEvent.click(screen.getByRole("button", { name: /Создать/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("API Error");
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
