import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AIBubble } from "@/components/song/AIBubble";

describe("AIBubble", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render question input by default", () => {
    render(<AIBubble onClose={() => {}} onSubmit={async () => {}} />);
    
    expect(screen.getByPlaceholderText(/What would you like to know about these lyrics/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ask AI/i })).toBeInTheDocument();
  });

  it("should call onSubmit when question is submitted", async () => {
    const handleSubmit = vi.fn().mockResolvedValue({ response: "AI response" });
    render(<AIBubble onClose={() => {}} onSubmit={handleSubmit} />);
    
    const input = screen.getByPlaceholderText(/What would you like to know about these lyrics/i);
    const button = screen.getByRole("button", { name: /Ask AI/i });
    
    fireEvent.change(input, { target: { value: "Explain this." } });
    fireEvent.click(button);
    
    expect(handleSubmit).toHaveBeenCalledWith("Explain this.");
  });

  it("should show loading state during submission", async () => {
    // A promise that doesn't resolve immediately
    let resolveSubmit: (val: any) => void;
    const slowSubmit = new Promise((resolve) => {
      resolveSubmit = resolve;
    });
    
    const handleSubmit = vi.fn().mockReturnValue(slowSubmit);
    render(<AIBubble onClose={() => {}} onSubmit={handleSubmit} />);
    
    const input = screen.getByPlaceholderText(/What would you like to know about these lyrics/i);
    const button = screen.getByRole("button", { name: /Ask AI/i });
    
    fireEvent.change(input, { target: { value: "Wait for me." } });
    fireEvent.click(button);
    
    expect(screen.getByTestId("ai-loading-indicator")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/What would you like to know about these lyrics/i)).not.toBeInTheDocument();
  });

  it("should display AI response when finished", async () => {
    const handleSubmit = vi.fn().mockResolvedValue({ response: "This is the answer." });
    render(<AIBubble onClose={() => {}} onSubmit={handleSubmit} />);
    
    const input = screen.getByPlaceholderText(/What would you like to know about these lyrics/i);
    const button = screen.getByRole("button", { name: /Ask AI/i });
    
    fireEvent.change(input, { target: { value: "Tell me." } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText("This is the answer.")).toBeInTheDocument();
    });
    
    expect(screen.queryByPlaceholderText(/What would you like to know about these lyrics/i)).not.toBeInTheDocument();
    expect(screen.getByText("AI Explanation")).toBeInTheDocument();
  });

  it("should show error message if submission fails", async () => {
    const handleSubmit = vi.fn().mockRejectedValue(new Error("API Error"));
    render(<AIBubble onClose={() => {}} onSubmit={handleSubmit} />);
    
    const input = screen.getByPlaceholderText(/What would you like to know about these lyrics/i);
    const button = screen.getByRole("button", { name: /Ask AI/i });
    
    fireEvent.change(input, { target: { value: "Fail me." } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeInTheDocument();
    });
  });
});
