import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AskAIPrompt } from "@/components/song/AskAIPrompt";

describe("AskAIPrompt", () => {
  it("should render with correctly", () => {
    render(<AskAIPrompt onClick={() => {}} />);
    expect(screen.getByRole("button", { name: /Ask AI/i })).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<AskAIPrompt onClick={handleClick} />);
    
    const button = screen.getByRole("button", { name: /Ask AI/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalled();
  });

  it("should have Frutiger Aero design classes", () => {
    render(<AskAIPrompt onClick={() => {}} />);
    const button = screen.getByRole("button", { name: /Ask AI/i });
    
    expect(button).toHaveClass("bg-indigo-500/90"); // Example of vibrant AI accent
    expect(button).toHaveClass("backdrop-blur-md");
    expect(button).toHaveClass("border-white/60");
  });
});
